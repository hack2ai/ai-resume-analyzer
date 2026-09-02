import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();
const credentials = z.object({ name: z.string().trim().min(2).max(80).optional(), email: z.string().email(), password: z.string().min(8).max(128) });
const sign = (id: string, email: string) => jwt.sign({ id, email }, process.env.JWT_SECRET || "", { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  const parsed = credentials.safeParse(req.body);
  if (!parsed.success || !parsed.data.name) return res.status(400).json({ error: "Name, valid email and password are required" });
  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "An account already exists for this email" });
  const user = await prisma.user.create({ data: { name: parsed.data.name, email, passwordHash: await bcrypt.hash(parsed.data.password, 12) } });
  res.status(201).json({ token: sign(user.id, user.email), user: { id: user.id, name: user.name, email: user.email } });
});

router.post("/login", async (req, res) => {
  const parsed = credentials.omit({ name: true }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Valid email and password are required" });
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return res.status(401).json({ error: "Invalid email or password" });
  res.json({ token: sign(user.id, user.email), user: { id: user.id, name: user.name, email: user.email } });
});

router.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { id: true, name: true, email: true, createdAt: true } });
  res.json({ user });
});

export default router;
