import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const analyses = await prisma.resumeAnalysis.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  const totalAnalyses = analyses.length;
  const averageAtsScore = totalAnalyses
    ? Math.round(analyses.reduce((sum, item) => sum + item.atsScore, 0) / totalAnalyses)
    : 0;
  const latest = analyses[0] || null;

  res.json({
    stats: {
      totalAnalyses,
      averageAtsScore,
      latestScore: latest?.atsScore ?? 0
    },
    analyses
  });
});

export default router;
