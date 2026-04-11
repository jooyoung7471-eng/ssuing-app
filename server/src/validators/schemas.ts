import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const correctionSchema = z.object({
  sentenceId: z.string().uuid("유효한 문장 ID를 입력해주세요"),
  userWriting: z.string().min(1, "영어 작문을 입력해주세요").max(1000),
  difficulty: z.enum(["beginner", "intermediate"]).optional().default("beginner"),
});

export const dailySentencesQuerySchema = z.object({
  theme: z.enum(["daily", "business"], {
    errorMap: () => ({ message: "테마는 daily 또는 business여야 합니다" }),
  }),
  difficulty: z.enum(["beginner", "intermediate"]).optional(),
});

export const reviewStartSchema = z.object({
  theme: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate"]).optional(),
  count: z.enum(["5", "10", "15", "20"]).transform(Number).or(z.literal(5)).or(z.literal(10)).or(z.literal(15)).or(z.literal(20)),
});

export const reviewSubmitSchema = z.object({
  sessionId: z.string().uuid("유효한 세션 ID를 입력해주세요"),
  sentenceId: z.string().uuid("유효한 문장 ID를 입력해주세요"),
  userWriting: z.string().min(1, "영어 작문을 입력해주세요").max(1000),
});

export const historyQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  theme: z.enum(["daily", "business"]).optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid("유효한 ID를 입력해주세요"),
});
