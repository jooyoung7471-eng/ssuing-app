import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { optionalAuthMiddleware } from "../middleware/auth";
import { correctionSchema } from "../validators/schemas";
import { correctWriting } from "../services/llm";
import { processCorrection } from "../services/gamification";
import { AppError } from "../middleware/errorHandler";
import { CorrectionHighlight } from "../types";
import { llmRateLimit } from "../middleware/rateLimit";

const router = Router();
const prisma = new PrismaClient();

router.post("/", llmRateLimit, optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sentenceId, koreanText, userWriting, difficulty } = correctionSchema.parse(req.body);
    const userId = req.user!.userId;

    // UUID 형태면 DB 직접 조회, 로컬 문장(sent_XXXX)이면 koreanText로 매칭
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sentenceId);
    let sentence: { id: string; korean_text: string } | null = null;

    if (isUuid) {
      sentence = await prisma.sentence.findUnique({ where: { id: sentenceId } });
    }

    // DB에 없으면 koreanText로 검색 시도
    if (!sentence && koreanText) {
      sentence = await prisma.sentence.findFirst({ where: { korean_text: koreanText } });
    }

    // DB에도 없고 koreanText가 있으면 Sentence 레코드를 생성 (로컬 문장 동기화)
    if (!sentence && koreanText) {
      sentence = await prisma.sentence.create({
        data: {
          korean_text: koreanText,
          theme: "daily",
          category: "general",
          difficulty: difficulty || "beginner",
          hint_words: "[]",
          tags: "[]",
        },
      });
    }

    if (!sentence) {
      throw new AppError(404, "NOT_FOUND", "문장을 찾을 수 없습니다. koreanText를 함께 전송해주세요.");
    }

    // Call LLM for correction
    const result = await correctWriting(sentence.korean_text, userWriting, difficulty);

    // Save correction to DB (sentence.id는 DB의 실제 UUID)
    const correction = await prisma.correction.create({
      data: {
        user_id: userId,
        sentence_id: sentence.id,
        user_writing: userWriting,
        corrected_sentence: result.correctedSentence,
        explanation: result.explanation,
        score: result.score,
        highlights: JSON.stringify(result.highlights),
      },
    });

    // Process gamification (XP, streak, achievements)
    const gamification = await processCorrection(userId, result.score, sentence.id);

    res.json({
      data: {
        id: correction.id,
        sentenceId: correction.sentence_id,
        userWriting: correction.user_writing,
        correctedSentence: correction.corrected_sentence,
        nativeExpressions: result.nativeExpressions,
        explanation: correction.explanation,
        keyExpression: result.keyExpression,
        score: correction.score,
        highlights: result.highlights,
        createdAt: correction.created_at.toISOString(),
        xpEarned: gamification.xpEarned,
        levelUp: gamification.levelUp,
        newLevel: gamification.newLevel,
        newAchievements: gamification.newAchievements,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
