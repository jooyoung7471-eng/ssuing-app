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

router.post("/social", authRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { provider, token: socialToken, email, name } = socialLoginSchema.parse(req.body);

    // In production, verify the social token with each provider's API:
    // - Apple: verify identityToken with Apple's public keys
    // - Google: verify idToken with Google's tokeninfo endpoint
    // - Kakao: verify access_token with Kakao's user/me endpoint
    // For now, we trust the token and use the email/socialId from the client.

    // Use the social token as a stand-in for the social_id.
    // In a real implementation, you'd decode/verify the token to extract the social user ID.
    const socialId = socialToken;

    // Try to find existing user by provider + socialId
    let user = await prisma.user.findFirst({
      where: { provider, social_id: socialId },
    });

    if (!user && email) {
      // Check if there's an existing user with this email (e.g., previously registered via email)
      user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        // Link the social account to the existing user
        user = await prisma.user.update({
          where: { id: user.id },
          data: { provider, social_id: socialId, name: name || user.name },
        });
      }
    }

    if (!user) {
      // Create a new user
      const userEmail = email || `${provider}_${socialId.substring(0, 8)}@social.ssuing.app`;
      user = await prisma.user.create({
        data: {
          email: userEmail,
          password: "social-login-no-password",
          provider,
          social_id: socialId,
          name: name || null,
        },
      });
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
