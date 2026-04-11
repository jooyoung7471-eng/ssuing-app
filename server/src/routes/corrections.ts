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
    const { sentenceId, userWriting, difficulty } = correctionSchema.parse(req.body);
    const userId = req.user!.userId;

    const sentence = await prisma.sentence.findUnique({ where: { id: sentenceId } });
    if (!sentence) {
      throw new AppError(404, "NOT_FOUND", "문장을 찾을 수 없습니다");
    }

    // Call LLM for correction
    const result = await correctWriting(sentence.korean_text, userWriting, difficulty);

    // Save correction to DB
    const correction = await prisma.correction.create({
      data: {
        user_id: userId,
        sentence_id: sentenceId,
        user_writing: userWriting,
        corrected_sentence: result.correctedSentence,
        explanation: result.explanation,
        score: result.score,
        highlights: JSON.stringify(result.highlights),
      },
    });

    // Process gamification (XP, streak, achievements)
    const gamification = await processCorrection(userId, result.score, sentenceId);

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
