import { Router } from "express";
import OpenAI from "openai";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const requestSchema = z.object({
  section: z.enum(["summary", "experience", "skills", "projects", "education", "custom"]),
  text: z.string().trim().min(10).max(12000),
  targetRole: z.string().trim().min(2).max(120),
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Provide a valid resume section and target role." });
  if (!client) return res.status(503).json({ error: "AI rewriting is not configured." });

  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      messages: [
        { role: "system", content: "You are an expert technical resume editor. Improve clarity, impact, ATS relevance, grammar and measurable outcomes. Never invent employers, degrees, skills, achievements, metrics or technologies. Return JSON only with rewrittenText, improvements, and keywordSuggestions." },
        { role: "user", content: `TARGET ROLE: ${parsed.data.targetRole}\nSECTION: ${parsed.data.section}\nORIGINAL TEXT:\n${parsed.data.text}` }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty AI response");
    const output = z.object({ rewrittenText: z.string().min(1).max(15000), improvements: z.array(z.string()).max(10), keywordSuggestions: z.array(z.string()).max(15) }).parse(JSON.parse(content));
    res.json(output);
  } catch (error) {
    console.error("Rewrite error", error);
    res.status(500).json({ error: "Unable to rewrite this resume section." });
  }
});

export default router;
