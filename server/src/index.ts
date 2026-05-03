import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// 서버 시작 시 DB 마이그레이션 실행 (소셜 로그인 컬럼 추가)
(async () => {
  const migrationPrisma = new PrismaClient();
  try {
    await migrationPrisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "provider" TEXT`);
    await migrationPrisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "social_id" TEXT`);
    await migrationPrisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT`);
    await migrationPrisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "User_provider_social_id_key" ON "User"("provider", "social_id")`);
    console.log("Migration: social login columns OK");
  } catch (e: any) {
    console.log("Migration note:", e.message);
  } finally {
    await migrationPrisma.$disconnect();
  }
})();
import { apiRateLimit } from "./middleware/rateLimit";
import authRoutes from "./routes/auth";
import sentenceRoutes from "./routes/sentences";
import correctionRoutes from "./routes/corrections";
import historyRoutes from "./routes/history";
import gamificationRoutes from "./routes/gamification";
import reviewRoutes from "./routes/review";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:8081", "http://localhost:19006"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Device-Id"],
    maxAge: 86400,
  })
);
app.use(express.json({ limit: "1mb" }));

// Security headers
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.removeHeader("X-Powered-By");
  next();
});

// Global rate limit
app.use(apiRateLimit);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sentences", sentenceRoutes);
app.use("/api/corrections", correctionRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/review", reviewRoutes);

// Privacy policy page
app.get("/privacy", (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>쓰잉 - 개인정보 처리방침</title>
<style>body{font-family:-apple-system,sans-serif;max-width:680px;margin:0 auto;padding:20px;line-height:1.7;color:#333}
h1{font-size:22px;border-bottom:2px solid #4A90D9;padding-bottom:8px}h2{font-size:17px;margin-top:28px;color:#1A1A2E}
table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}</style>
</head><body>
<h1>쓰잉 개인정보 처리방침</h1>
<p>시행일: 2026년 4월 1일</p>
<h2>1. 수집하는 개인정보</h2>
<p>쓰잉은 현재 회원가입 없이 사용할 수 있으며, 개인 식별 정보를 수집하지 않습니다. 기기별 고유 식별자(UUID)를 생성하여 학습 기록을 구분합니다.</p>
<h2>2. 수집 목적</h2>
<p>기기 식별자: 학습 기록 저장 및 진행 상황 관리<br>작성한 영어 문장: AI 교정 서비스 제공</p>
<h2>3. 보유 기간</h2>
<p>서비스 이용 기간 동안 보관하며, 별도 요청 시 즉시 삭제합니다.</p>
<h2>4. 제3자 제공</h2>
<p>수집된 정보는 제3자에게 제공하지 않습니다. 단, AI 교정을 위해 작성한 문장이 Anthropic API로 전송됩니다.</p>
<h2>5. 이용자의 권리</h2>
<p>학습 기록 삭제를 요청할 수 있습니다. 아래 연락처로 문의해주세요.</p>
<h2>6. 문의</h2>
<table><tr><th>항목</th><th>내용</th></tr>
<tr><td>서비스명</td><td>쓰잉 - 영어 작문 트레이너</td></tr>
<tr><td>연락처</td><td>ssuing.app@gmail.com</td></tr></table>
</body></html>`);
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ data: { status: "ok" } });
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? "set" : "NOT SET"}`);
  console.log(`ANTHROPIC_API_KEY: ${process.env.ANTHROPIC_API_KEY ? "set" : "NOT SET"}`);
  console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? "set" : "using default"}`);
});

export default app;
// trigger redeploy 1777791110
