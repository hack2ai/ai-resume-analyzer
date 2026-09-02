import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type AuthenticatedRequest = Request & { user?: { id: string; email: string } };

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(503).json({ error: "Authentication is not configured." });

  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return res.status(401).json({ error: "Authentication required" });

  try {
    const payload = jwt.verify(token, secret) as { id: string; email: string };
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
