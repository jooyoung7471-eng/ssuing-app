import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .max(128, "비밀번호는 128자 이하여야 합니다"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const socialLoginSchema = z.object({
  provider: z.enum(["apple", "google", "kakao"], {
    errorMap: () => ({ message: "provider는 apple, google, kakao 중 하나여야 합니다" }),
  }),
  token: z.string().min(1, "소셜 로그인 토큰이 필요합니다"),
  email: z.string().email().optional().nullable(),
  name: z.string().optional().nullable(),
});

export const correctionSchema = z.object({
  sentenceId: z.string().min(1, "문장 ID를 입력해주세요"),
  koreanText: z.string().optional(),
  userWriting: z.string().min(1, "영어 작문을 입력해주세요").max(1000),
  difficulty: z.enum(["beginner", "intermediate"]).optional().default("beginner"),
});

export const dailySentencesQuerySchema = z.object({
  theme: z.enum(["daily", "business", "travel"], {
    errorMap: () => ({ message: "테마는 daily, business 또는 travel이어야 합니다" }),
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
  sentenceId: z.string().min(1, "문장 ID를 입력해주세요"),
  koreanText: z.string().optional(),
  userWriting: z.string().min(1, "영어 작문을 입력해주세요").max(1000),
});

export const historyQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  theme: z.enum(["daily", "business", "travel"]).optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid("유효한 ID를 입력해주세요"),
});
