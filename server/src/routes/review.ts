import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { optionalAuthMiddleware } from "../middleware/auth";
import { correctionSchema, reviewStartSchema, reviewSubmitSchema, idParamSchema } from "../validators/schemas";
import { correctWriting } from "../services/llm";
import { processCorrection } from "../services/gamification";
import { AppError } from "../middleware/errorHandler";
import { HintWord } from "../types";

const router = Router();
const prisma = new PrismaClient();

// GET /api/review/weak — corrections with score < 7
router.get("/weak", optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const weakCorrections = await prisma.correction.findMany({
      where: {
        user_id: userId,
        score: { lt: 7 },
      },
      include: {
        sentence: true,
      },
      orderBy: { created_at: "desc" },
    });

    const data = weakCorrections.map((c) => ({
      id: c.id,
      sentenceId: c.sentence_id,
      koreanText: c.sentence.korean_text,
      theme: c.sentence.theme,
      category: c.sentence.category,
      userWriting: c.user_writing,
      correctedSentence: c.corrected_sentence,
      explanation: c.explanation,
      score: c.score,
      highlights: JSON.parse(c.highlights),
      createdAt: c.created_at.toISOString(),
    }));

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

// POST /api/review/retry — re-submit a sentence for correction (review mode)
router.post("/retry", optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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

    // Process gamification
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
        newAchievements: gamification.newAchievements,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/review/start — start a review session
router.post("/start", optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { theme, difficulty, count } = reviewStartSchema.parse(req.body);
    const userId = req.user!.userId;

    // Build where clause for sentence selection
    const sentenceWhere: Record<string, unknown> = {};
    if (theme) sentenceWhere.theme = theme;
    if (difficulty) sentenceWhere.difficulty = difficulty;

    // Weighted selection: prioritize low-score and old corrections
    // 1) Get sentences the user scored poorly on
    const weakSentenceIds = (
      await prisma.correction.findMany({
        where: { user_id: userId, score: { lt: 7 } },
        orderBy: [{ score: "asc" }, { created_at: "asc" }],
        select: { sentence_id: true },
        distinct: ["sentence_id"],
      })
    ).map((c) => c.sentence_id);

    // 2) Get sentences the user hasn't practiced recently
    const oldSentenceIds = (
      await prisma.correction.findMany({
        where: { user_id: userId },
        orderBy: { created_at: "asc" },
        select: { sentence_id: true },
        distinct: ["sentence_id"],
      })
    ).map((c) => c.sentence_id);

    // 3) Combine: weak first, then old, then fill with random
    const priorityIds = [...new Set([...weakSentenceIds, ...oldSentenceIds])];

    // Fetch candidates matching theme/difficulty
    const allCandidates = await prisma.sentence.findMany({
      where: sentenceWhere,
      select: { id: true, korean_text: true, hint_words: true },
    });

    // Sort candidates: priority sentences first
    const prioritySet = new Set(priorityIds);
    const prioritized = allCandidates.sort((a, b) => {
      const aIdx = priorityIds.indexOf(a.id);
      const bIdx = priorityIds.indexOf(b.id);
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return Math.random() - 0.5;
    });

    const selected = prioritized.slice(0, count as number);

    if (selected.length === 0) {
      throw new AppError(404, "NOT_FOUND", "조건에 맞는 문장이 없습니다");
    }

    // Create review session
    const session = await prisma.reviewSession.create({
      data: {
        user_id: userId,
        theme: theme || null,
        difficulty: difficulty || null,
        total_count: selected.length,
      },
    });

    const sentences = selected.map((s) => ({
      id: s.id,
      koreanText: s.korean_text,
      hintWords: JSON.parse(s.hint_words) as HintWord[],
    }));

    res.json({
      data: {
        sessionId: session.id,
        sentences,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/review/submit — submit an answer for a review session
router.post("/submit", optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, sentenceId, userWriting } = reviewSubmitSchema.parse(req.body);
    const userId = req.user!.userId;

    // Verify session belongs to user
    const session = await prisma.reviewSession.findUnique({ where: { id: sessionId } });
    if (!session || session.user_id !== userId) {
      throw new AppError(404, "NOT_FOUND", "복습 세션을 찾을 수 없습니다");
    }

    // Get sentence
    const sentence = await prisma.sentence.findUnique({ where: { id: sentenceId } });
    if (!sentence) {
      throw new AppError(404, "NOT_FOUND", "문장을 찾을 수 없습니다");
    }

    // Call LLM for correction
    const difficulty = session.difficulty || sentence.difficulty || "beginner";
    const result = await correctWriting(sentence.korean_text, userWriting, difficulty);

    // Save ReviewAnswer
    const answer = await prisma.reviewAnswer.create({
      data: {
        session_id: sessionId,
        sentence_id: sentenceId,
        user_writing: userWriting,
        score: result.score,
        correction: JSON.stringify(result),
      },
    });

    // Also save as a Correction for history tracking
    await prisma.correction.create({
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

    res.json({
      data: {
        answerId: answer.id,
        correctedSentence: result.correctedSentence,
        nativeExpressions: result.nativeExpressions,
        explanation: result.explanation,
        keyExpression: result.keyExpression,
        score: result.score,
        highlights: result.highlights,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/review/result/:sessionId — get full results for a review session
router.get("/result/:sessionId", optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: sessionId } = idParamSchema.parse({ id: req.params.sessionId });
    const userId = req.user!.userId;

    const session = await prisma.reviewSession.findUnique({
      where: { id: sessionId },
      include: {
        answers: {
          include: { sentence: true },
          orderBy: { answered_at: "asc" },
        },
      },
    });

    if (!session || session.user_id !== userId) {
      throw new AppError(404, "NOT_FOUND", "복습 세션을 찾을 수 없습니다");
    }

    const answers = session.answers.map((a) => ({
      answerId: a.id,
      sentenceId: a.sentence_id,
      koreanText: a.sentence.korean_text,
      userWriting: a.user_writing,
      score: a.score,
      correction: a.correction ? JSON.parse(a.correction) : null,
      answeredAt: a.answered_at.toISOString(),
    }));

    const scores = answers.filter((a) => a.score !== null).map((a) => a.score as number);
    const avgScore = scores.length > 0 ? Math.round((scores.reduce((s, v) => s + v, 0) / scores.length) * 10) / 10 : null;

    const sortedByScore = [...answers].filter((a) => a.score !== null).sort((a, b) => (a.score as number) - (b.score as number));
    const worst = sortedByScore.length > 0 ? sortedByScore[0] : null;
    const best = sortedByScore.length > 0 ? sortedByScore[sortedByScore.length - 1] : null;

    res.json({
      data: {
        sessionId: session.id,
        theme: session.theme,
        difficulty: session.difficulty,
        totalCount: session.total_count,
        answeredCount: session.answers.length,
        averageScore: avgScore,
        best,
        worst,
        answers,
        createdAt: session.created_at.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
