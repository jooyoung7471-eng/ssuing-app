import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { optionalAuthMiddleware } from "../middleware/auth";
import { historyQuerySchema, idParamSchema } from "../validators/schemas";
import { AppError } from "../middleware/errorHandler";
import { CorrectionHighlight } from "../types";

const router = Router();
const prisma = new PrismaClient();

router.get("/stats", optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const corrections = await prisma.correction.findMany({
      where: { user_id: userId },
      select: { score: true, created_at: true },
      orderBy: { created_at: "desc" },
    });

    const totalCorrections = corrections.length;
    const averageScore =
      totalCorrections > 0
        ? Math.round((corrections.reduce((sum, c) => sum + c.score, 0) / totalCorrections) * 10) / 10
        : 0;

    // Daily stats
    const dailyMap = new Map<string, { count: number; totalScore: number }>();
    for (const c of corrections) {
      const date = c.created_at.toISOString().split("T")[0];
      const entry = dailyMap.get(date) || { count: 0, totalScore: 0 };
      entry.count++;
      entry.totalScore += c.score;
      dailyMap.set(date, entry);
    }

    const dailyStats = Array.from(dailyMap.entries())
      .map(([date, { count, totalScore }]) => ({
        date,
        count,
        averageScore: Math.round((totalScore / count) * 10) / 10,
      }))
      .slice(0, 30);

    // Weekly stats
    const weeklyMap = new Map<string, { count: number; totalScore: number }>();
    for (const c of corrections) {
      const d = c.created_at;
      const yearStart = new Date(d.getFullYear(), 0, 1);
      const weekNum = Math.ceil(
        ((d.getTime() - yearStart.getTime()) / 86400000 + yearStart.getDay() + 1) / 7
      );
      const week = `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
      const entry = weeklyMap.get(week) || { count: 0, totalScore: 0 };
      entry.count++;
      entry.totalScore += c.score;
      weeklyMap.set(week, entry);
    }

    const weeklyStats = Array.from(weeklyMap.entries())
      .map(([week, { count, totalScore }]) => ({
        week,
        count,
        averageScore: Math.round((totalScore / count) * 10) / 10,
      }))
      .slice(0, 12);

    // Streak calculation
    let streakDays = 0;
    const sortedDates = Array.from(dailyMap.keys()).sort().reverse();
    const today = new Date().toISOString().split("T")[0];
    let checkDate = today;

    for (const date of sortedDates) {
      if (date === checkDate) {
        streakDays++;
        const prev = new Date(checkDate);
        prev.setDate(prev.getDate() - 1);
        checkDate = prev.toISOString().split("T")[0];
      } else if (date < checkDate) {
        break;
      }
    }

    res.json({
      data: {
        totalCorrections,
        averageScore,
        streakDays,
        dailyStats,
        weeklyStats,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/", optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { page, limit, theme } = historyQuerySchema.parse(req.query);

    const where: Record<string, unknown> = { user_id: userId };
    if (theme) {
      where.sentence = { theme };
    }

    const [corrections, total] = await Promise.all([
      prisma.correction.findMany({
        where,
        include: { sentence: true },
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.correction.count({ where }),
    ]);

    res.json({
      data: corrections.map((c) => ({
        id: c.id,
        sentenceId: c.sentence_id,
        koreanText: c.sentence.korean_text,
        userWriting: c.user_writing,
        correctedSentence: c.corrected_sentence,
        score: c.score,
        createdAt: c.created_at.toISOString(),
      })),
      pagination: { page, limit, total },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const userId = req.user!.userId;

    const correction = await prisma.correction.findFirst({
      where: { id, user_id: userId },
      include: { sentence: true },
    });

    if (!correction) {
      throw new AppError(404, "NOT_FOUND", "학습 기록을 찾을 수 없습니다");
    }

    res.json({
      data: {
        id: correction.id,
        sentenceId: correction.sentence_id,
        koreanText: correction.sentence.korean_text,
        userWriting: correction.user_writing,
        correctedSentence: correction.corrected_sentence,
        explanation: correction.explanation,
        score: correction.score,
        highlights: JSON.parse(correction.highlights) as CorrectionHighlight[],
        createdAt: correction.created_at.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
