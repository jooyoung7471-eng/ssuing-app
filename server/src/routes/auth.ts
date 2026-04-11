import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { registerSchema, loginSchema } from "../validators/schemas";
import { hashPassword, comparePassword, generateToken } from "../services/auth";
import { AppError } from "../middleware/errorHandler";
import { authRateLimit } from "../middleware/rateLimit";

const router = Router();
const prisma = new PrismaClient();

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

export default router;
