import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { registerSchema, loginSchema, socialLoginSchema } from "../validators/schemas";
import { hashPassword, comparePassword, generateToken } from "../services/auth";
import { AppError } from "../middleware/errorHandler";
import { authMiddleware } from "../middleware/auth";
import { authRateLimit } from "../middleware/rateLimit";

const router = Router();
const prisma = new PrismaClient();

// --- Legacy email/password endpoints (kept for backward compatibility) ---

router.post("/register", authRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError(409, "CONFLICT", "이미 등록된 이메일입니다");
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const token = generateToken({ userId: user.id, email: user.email });

    res.status(201).json({
      data: {
        id: user.id,
        email: user.email,
        token,
        createdAt: user.created_at.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", authRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "이메일 또는 비밀번호가 올바르지 않습니다");
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      throw new AppError(401, "UNAUTHORIZED", "이메일 또는 비밀번호가 올바르지 않습니다");
    }

    const token = generateToken({ userId: user.id, email: user.email });

    res.json({
      data: {
        id: user.id,
        email: user.email,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

// --- Social Login ---

/**
 * JWT payload를 검증 없이 디코드한다.
 * Apple/Google identity token에서 stable user id(sub)와 email을 추출하기 위함.
 * (운영 환경에서는 서명 검증을 추가해야 함)
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    // base64url -> base64
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "===".slice((b64.length + 3) % 4);
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * provider별 stable social id를 추출한다.
 * - apple/google: identity token JWT의 sub
 * - kakao: 토큰을 그대로 사용 (서버가 별도 검증/조회 가능)
 * 디코드 실패 시 token 자체를 폴백으로 사용 (기존 동작 유지).
 */
function extractStableSocialId(provider: string, token: string): { socialId: string; email?: string | null; name?: string | null } {
  if (provider === "apple" || provider === "google") {
    const payload = decodeJwtPayload(token);
    if (payload && typeof payload.sub === "string" && payload.sub.length > 0) {
      const sub = payload.sub as string;
      const decodedEmail = typeof payload.email === "string" ? (payload.email as string) : null;
      const decodedName = typeof payload.name === "string" ? (payload.name as string) : null;
      return { socialId: sub, email: decodedEmail, name: decodedName };
    }
  }
  // Fallback: 토큰을 그대로 사용 (kakao 또는 디코드 실패)
  // 토큰이 너무 길면 잘라서 컬럼 길이 보호
  return { socialId: token.length > 255 ? token.slice(0, 255) : token };
}

router.post("/social", authRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { provider, token: socialToken, email: clientEmail, name: clientName } = socialLoginSchema.parse(req.body);

    // Identity token에서 stable social id를 추출 (Apple은 매 로그인마다 token이 바뀌지만 sub는 동일)
    const extracted = extractStableSocialId(provider, socialToken);
    const socialId = extracted.socialId;
    // 이메일/이름은 클라이언트가 보낸 값이 우선 (Apple은 첫 가입에만 제공),
    // 없으면 토큰에서 디코드한 값 사용
    const email = clientEmail ?? extracted.email ?? null;
    const name = clientName ?? extracted.name ?? null;

    // 1) provider + socialId로 기존 사용자 조회 (가장 안정적인 키)
    let user = await prisma.user.findFirst({
      where: { provider, social_id: socialId },
    });

    // 2) email로 기존 사용자 조회 (이메일 가입 → 소셜 전환 등)
    if (!user && email) {
      user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { provider, social_id: socialId, name: name || user.name },
        });
      }
    }

    // 3) 신규 사용자 생성
    if (!user) {
      // placeholder email은 socialId 전체 + 랜덤 suffix를 사용해 충돌을 회피한다.
      // 기존 코드: `${provider}_${socialId.substring(0, 8)}@social.ssuing.app` 형태였는데,
      // Apple sub는 `001234.<hex>` 패턴이라 첫 8자가 자주 겹쳐서 email unique 충돌이 발생했다.
      // (BUG: 이로 인해 두 번째 신규 가입자부터 500 에러가 발생)
      const buildPlaceholderEmail = () => {
        const safeSocial = socialId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 24) || "user";
        const rand = Math.random().toString(36).slice(2, 10);
        return `${provider}_${safeSocial}_${rand}@social.ssuing.app`;
      };
      const userEmail = email || buildPlaceholderEmail();

      // 동일 socialId/email 충돌 시 race condition 및 누적 데이터 충돌 방지
      const tryCreate = async (emailToUse: string) =>
        prisma.user.create({
          data: {
            email: emailToUse,
            password: "social-login-no-password",
            provider,
            social_id: socialId,
            name: name || null,
          },
        });

      try {
        user = await tryCreate(userEmail);
      } catch (createErr: any) {
        // unique 제약 충돌(P2002): 동시 요청 또는 placeholder email 충돌
        if (createErr?.code === "P2002") {
          // 1) provider+social_id 기준 재조회 (race로 같은 사용자가 이미 생성된 경우)
          user = await prisma.user.findFirst({ where: { provider, social_id: socialId } });
          // 2) email 기준 재조회 (클라이언트가 email을 줬는데 동시에 가입된 경우)
          if (!user && email) {
            user = await prisma.user.findUnique({ where: { email } });
          }
          // 3) 그래도 없으면 placeholder email 충돌이므로 새 placeholder로 1회 재시도
          if (!user && !email) {
            try {
              user = await tryCreate(buildPlaceholderEmail());
            } catch (retryErr: any) {
              if (retryErr?.code === "P2002") {
                user = await prisma.user.findFirst({ where: { provider, social_id: socialId } });
              }
              if (!user) throw retryErr;
            }
          }
        }
        if (!user) throw createErr;
      }
    }

    const jwtToken = generateToken({ userId: user.id, email: user.email });

    res.json({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        token: jwtToken,
      },
    });
  } catch (err) {
    next(err);
  }
});

// --- Account Deletion ---

router.delete("/account", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    // All related data is deleted via onDelete: Cascade in the Prisma schema
    await prisma.user.delete({ where: { id: userId } });

    res.json({
      data: { message: "계정이 성공적으로 삭제되었습니다" },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
