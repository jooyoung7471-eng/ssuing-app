import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { optionalAuthMiddleware } from "../middleware/auth";
import { dailySentencesQuerySchema, idParamSchema } from "../validators/schemas";
import { getDailySentences } from "../services/sentenceSelector";
import { AppError } from "../middleware/errorHandler";
import { HintWord } from "../types";

const router = Router();
const prisma = new PrismaClient();

const syncSchema = z.object({
  theme: z.enum(["daily", "business", "travel"]),
  difficulty: z.enum(["beginner", "intermediate"]).optional().default("beginner"),
  sentenceIds: z.array(z.string()).max(50),
  sentenceTexts: z.array(z.string()).max(50).optional(),
});

router.get("/daily", optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { theme, difficulty } = dailySentencesQuerySchema.parse(req.query);
    const userId = req.user!.userId;
    const today = new Date().toISOString().split("T")[0];

    const dailySentences = await getDailySentences(prisma, userId, theme, today, difficulty);

    // Check completion status for each sentence
    const sentenceIds = dailySentences.map((ds) => ds.sentence_id);
    const corrections = await prisma.correction.findMany({
      where: {
        user_id: userId,
        sentence_id: { in: sentenceIds },
        created_at: {
          gte: new Date(today),
          lt: new Date(new Date(today).getTime() + 86400000),
        },
      },
      select: { sentence_id: true },
    });
    const completedIds = new Set(corrections.map((c) => c.sentence_id));

    const data = dailySentences.map((ds) => ({
      id: ds.sentence.id,
      koreanText: ds.sentence.korean_text,
      theme: ds.sentence.theme,
      difficulty: ds.sentence.difficulty,
      hintWords: JSON.parse(ds.sentence.hint_words) as HintWord[],
      order: ds.order,
      isCompleted: completedIds.has(ds.sentence_id),
    }));

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

/**
 * 클라이언트 로컬 선정 결과를 받아 서버 측 완료(corrections) 상태와 병합 응답.
 * - DB에 저장된 corrections (오늘 작성된 것)을 조회하여 isCompleted 매핑
 * - 미존재 sentenceId는 건너뜀 (DB에 시드되지 않은 로컬 문장)
 */
router.post("/daily/sync", optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sentenceIds } = syncSchema.parse(req.body);
    const userId = req.user!.userId;
    const today = new Date().toISOString().split("T")[0];

    if (sentenceIds.length === 0) {
      res.json({ data: [] });
      return;
    }

    const corrections = await prisma.correction.findMany({
      where: {
        user_id: userId,
        sentence_id: { in: sentenceIds },
        created_at: {
          gte: new Date(today),
          lt: new Date(new Date(today).getTime() + 86400000),
        },
      },
      select: { sentence_id: true },
    });
    const completedIds = new Set(corrections.map((c) => c.sentence_id));

    // 클라이언트가 보낸 순서를 유지한 응답 (isCompleted 만 채움)
    // 다른 필드는 클라이언트가 로컬 데이터를 그대로 사용하도록 비워서 반환
    const data = sentenceIds.map((id, i) => ({
      id,
      order: i + 1,
      isCompleted: completedIds.has(id),
    }));

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = idParamSchema.parse(req.params);

    const sentence = await prisma.sentence.findUnique({ where: { id } });
    if (!sentence) {
      throw new AppError(404, "NOT_FOUND", "문장을 찾을 수 없습니다");
    }

    res.json({
      data: {
        id: sentence.id,
        koreanText: sentence.korean_text,
        theme: sentence.theme,
        difficulty: sentence.difficulty,
        hintWords: JSON.parse(sentence.hint_words) as HintWord[],
        createdAt: sentence.created_at.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
