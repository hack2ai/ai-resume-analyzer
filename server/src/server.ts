import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import multer from "multer";
import pdf from "pdf-parse";
import OpenAI from "openai";
import { z } from "zod";
import { prisma } from "./lib/prisma.js";
import { requireAuth, type AuthenticatedRequest } from "./middleware/auth.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import rewriteRoutes from "./routes/rewrite.routes.js";
import reportRoutes from "./routes/report.routes.js";

const app = express();
const port = Number(process.env.PORT || 3001);
const maxFileSize = Number(process.env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024;
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((origin) => origin.trim()).filter(Boolean);

// Google AI Studio / Gemini is used through Google's OpenAI-compatible endpoint.
// This lets the existing OpenAI TypeScript SDK stay in place while using a Gemini API key.
const gemini = process.env.GEMINI_API_KEY
  ? new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai/",
      defaultHeaders: { "x-goog-api-client": "resumeiq-ai/2.0" }
    })
  : null;

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxFileSize, files: 1 },
  fileFilter: (_req, file, callback) => callback(null, file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf"))
});

const outputSchema = z.object({
  atsScore: z.number().min(0).max(100),
  matchPercentage: z.number().min(0).max(100),
  missingKeywords: z.array(z.string()).max(20),
  strengths: z.array(z.string()).max(20),
  improvements: z.array(z.string()).max(20),
  summary: z.string().max(1200)
});

app.get("/health", (_req, res) => res.json({ status: "ok", service: "resumeiq-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/rewrite", rewriteRoutes);
app.use("/api/reports", reportRoutes);

app.post("/api/analyze", requireAuth, upload.single("resume"), async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "A PDF resume is required." });
    if (!req.body.jobDescription || typeof req.body.jobDescription !== "string" || req.body.jobDescription.trim().length < 30) {
      return res.status(400).json({ error: "Please provide a meaningful job description." });
    }
    if (!gemini) return res.status(503).json({ error: "AI analysis is not configured. Add GEMINI_API_KEY on the server." });

    const parsed = await pdf(req.file.buffer);
    const resumeText = parsed.text.replace(/\s+/g, " ").trim();
    if (resumeText.length < 100) return res.status(400).json({ error: "The PDF does not contain enough readable resume text." });

    const response = await gemini.chat.completions.create({
      model: process.env.GEMINI_MODEL || "gemini-3.7-flash",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a precise resume and ATS analyst. Return only valid JSON with atsScore, matchPercentage, missingKeywords, strengths, improvements, and summary. Scores are estimates, not hiring decisions. Be practical and do not invent experience." },
        { role: "user", content: `RESUME:\n${resumeText}\n\nTARGET JOB DESCRIPTION:\n${req.body.jobDescription.trim()}\n\nAnalyze the match and return the requested JSON.` }
      ]
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("The AI service returned an empty response.");
    const analysis = outputSchema.parse(JSON.parse(content));
    const saved = await prisma.resumeAnalysis.create({
      data: { userId: req.user!.id, resumeFileName: req.file.originalname, jobTitle: req.body.jobTitle?.trim() || null, ...analysis }
    });
    res.json({ ...analysis, analysisId: saved.id, createdAt: saved.createdAt });
  } catch (error) {
    console.error("Analysis error", error);
    if (error instanceof z.ZodError) return res.status(502).json({ error: "The AI returned an invalid analysis format." });
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unable to analyze the resume." });
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof multer.MulterError) return res.status(400).json({ error: error.message });
  if (error instanceof Error && error.message === "Origin is not allowed by CORS") return res.status(403).json({ error: error.message });
  console.error("Unexpected server error", error);
  return res.status(500).json({ error: "Unexpected server error." });
});

app.listen(port, () => console.log(`ResumeIQ API listening on port ${port}`));
