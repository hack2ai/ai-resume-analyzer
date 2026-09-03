import { Router } from "express";
import OpenAI from "openai";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();
const gemini = process.env.GEMINI_API_KEY ? new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai/"
}) : null;

const schema = z.object({
  targetRole: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160).optional().default(""),
  jobDescription: z.string().trim().min(30).max(20000),
  resumeText: z.string().trim().min(50).max(30000)
});

router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Provide a target role, job description, and resume text." });
  if (!gemini) return res.status(503).json({ error: "AI generation is not configured. Add GEMINI_API_KEY on the server." });
  try {
    const { targetRole, company, jobDescription, resumeText } = parsed.data;
    const response = await gemini.chat.completions.create({
      model: process.env.GEMINI_MODEL || "gemini-3.7-flash",
      messages: [
        { role: "system", content: "You are a professional cover letter editor. Write a concise, specific cover letter of 250-450 words. Use only evidence present in the resume and job description. Never invent employers, qualifications, metrics, projects, or experience. Use a professional tone. Return plain text only, with no markdown." },
        { role: "user", content: `TARGET ROLE: ${targetRole}\nCOMPANY: ${company || "Not specified"}\nJOB DESCRIPTION:\n${jobDescription}\n\nRESUME:\n${resumeText}` }
      ]
    });
    const content = response.choices[0]?.message?.content?.trim();
    if (!content) throw new Error("The AI service returned an empty response.");
    const saved = await prisma.coverLetter.create({ data: { userId: req.user!.id, targetRole, company: company || null, jobDescription, resumeText, content } });
    res.json({ id: saved.id, content: saved.content, createdAt: saved.createdAt });
  } catch (error) {
    console.error("Cover letter error", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to generate cover letter." });
  }
});

router.get("/history", requireAuth, async (req: AuthenticatedRequest, res) => {
  const letters = await prisma.coverLetter.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: "desc" }, take: 20, select: { id: true, targetRole: true, company: true, content: true, createdAt: true } });
  res.json({ letters });
});

export default router;
