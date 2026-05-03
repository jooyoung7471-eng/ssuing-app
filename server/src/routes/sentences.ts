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
 * - 클라이언트는 로컬 sentenceId(sent_xxxx)와 koreanText를 함께 전송
 * - DB의 Sentence.id는 UUID이므로, koreanText로 DB UUID를 조회해 corrections 매칭
 *   (BUG FIX: 이전 구현은 sent_xxxx로 corrections.sentence_id를 검색했는데
 *    DB는 UUID로 저장돼 있어 영원히 isCompleted=false를 반환했음)
 * - DB에 없는 koreanText는 미완료로 처리 (클라가 새 작성 시 corrections POST에서 자동 시딩됨)
 */
router.post("/daily/sync", optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sentenceIds, sentenceTexts } = syncSchema.parse(req.body);
    const userId = req.user!.userId;
    const today = new Date().toISOString().split("T")[0];

    if (sentenceIds.length === 0) {
      res.json({ data: [] });
      return;
    }

    // 1) 클라가 koreanText를 보낸 경우: koreanText → DB UUID 매핑 후 corrections 조회 (정확)
    // 2) koreanText 미수신: 레거시 동작 (sentenceId 자체로 검색 — DB sentence가 UUID면 매칭 안 됨)
    // BUG FIX: 같은 koreanText로 DB에 여러 row가 있을 수 있어(unique 제약 부재 + race로 중복 생성)
    //   1:N 매핑(string -> string[])로 모든 row id를 검사. 다중 디바이스에서 회귀 방지.
    const externalToDbIds = new Map<string, string[]>();
    if (sentenceTexts && sentenceTexts.length === sentenceIds.length) {
      const dbSentences = await prisma.sentence.findMany({
        where: { korean_text: { in: sentenceTexts } },
        select: { id: true, korean_text: true },
      });
      const textToDbIds = new Map<string, string[]>();
      for (const s of dbSentences) {
        const arr = textToDbIds.get(s.korean_text) || [];
        arr.push(s.id);
        textToDbIds.set(s.korean_text, arr);
      }
      sentenceIds.forEach((extId, i) => {
        const text = sentenceTexts[i];
        const dbIds = text ? textToDbIds.get(text) : undefined;
        if (dbIds && dbIds.length > 0) externalToDbIds.set(extId, dbIds);
      });
    }

    // sentenceId가 이미 UUID 형태이면 그대로 사용 (legacy 호환)
    sentenceIds.forEach((id) => {
      if (!externalToDbIds.has(id) && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        externalToDbIds.set(id, [id]);
      }
    });

    const dbIdsToQuery = Array.from(new Set(Array.from(externalToDbIds.values()).flat()));
    const corrections = dbIdsToQuery.length === 0 ? [] : await prisma.correction.findMany({
      where: {
        user_id: userId,
        sentence_id: { in: dbIdsToQuery },
        created_at: {
          gte: new Date(today),
          lt: new Date(new Date(today).getTime() + 86400000),
        },
      },
      select: { sentence_id: true },
    });
    const completedDbIds = new Set(corrections.map((c) => c.sentence_id));

    // 클라이언트가 보낸 순서 유지하여 isCompleted 매핑.
    // 매핑된 dbIds 중 하나라도 corrections에 있으면 isCompleted=true (1:N 안전)
    const data = sentenceIds.map((id, i) => {
      const dbIds = externalToDbIds.get(id) || [];
      const isCompleted = dbIds.some((dbId) => completedDbIds.has(dbId));
      return {
        id,
        order: i + 1,
        isCompleted,
      };
    });

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
