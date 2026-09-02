import { Router } from "express";
import OpenAI from "openai";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();
const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const requestSchema = z.object({ section:z.enum(["summary","experience","skills","projects","education","custom"]), text:z.string().trim().min(10).max(12000), targetRole:z.string().trim().min(2).max(120) });
const outputSchema = z.object({ rewrittenText:z.string().min(1).max(15000), improvements:z.array(z.string()).max(10), keywordSuggestions:z.array(z.string()).max(15) });

router.post("/", requireAuth, async (req: AuthenticatedRequest,res) => {
  const parsed=requestSchema.safeParse(req.body); if(!parsed.success)return res.status(400).json({error:"Provide a valid resume section and target role."}); if(!client)return res.status(503).json({error:"AI rewriting is not configured."});
  try { const completion=await client.chat.completions.create({model:process.env.OPENAI_MODEL||"gpt-5-mini",response_format:{type:"json_object"},messages:[{role:"system",content:"You are an expert technical resume editor. Improve clarity, impact, ATS relevance and grammar. Never invent employers, degrees, skills, achievements, metrics or technologies. Return JSON only with rewrittenText, improvements, and keywordSuggestions."},{role:"user",content:`TARGET ROLE: ${parsed.data.targetRole}\nSECTION: ${parsed.data.section}\nORIGINAL TEXT:\n${parsed.data.text}`}]}); const content=completion.choices[0]?.message?.content; if(!content)throw new Error("Empty AI response"); const output=outputSchema.parse(JSON.parse(content)); const saved=await prisma.resumeRewrite.create({data:{userId:req.user!.id,section:parsed.data.section,targetRole:parsed.data.targetRole,originalText:parsed.data.text,rewrittenText:output.rewrittenText,improvements:output.improvements,keywordSuggestions:output.keywordSuggestions}}); res.json({...output,id:saved.id,createdAt:saved.createdAt}); } catch(error){console.error("Rewrite error",error);res.status(500).json({error:"Unable to rewrite this resume section."});}
});

router.get("/history", requireAuth, async (req: AuthenticatedRequest,res)=>{const rewrites=await prisma.resumeRewrite.findMany({where:{userId:req.user!.id},orderBy:{createdAt:"desc"},take:30});res.json({rewrites});});
export default router;
