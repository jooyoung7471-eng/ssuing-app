import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "../types";
import { AppError } from "./errorHandler";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const GUEST_USER_ID = "guest-user-00000000";
const prisma = new PrismaClient();

async function ensureGuestUser() {
  const existing = await prisma.user.findUnique({ where: { id: GUEST_USER_ID } });
  if (!existing) {
    await prisma.user.create({
      data: { id: GUEST_USER_ID, email: "guest@engwrite.local", password: "guest" },
    });
  }
}
ensureGuestUser().catch(() => {});

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new AppError(401, "UNAUTHORIZED", "인증 토큰이 필요합니다");
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    throw new AppError(401, "UNAUTHORIZED", "유효하지 않은 토큰입니다");
  }
}

export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    const token = header.slice(7);
    try {
      const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
      req.user = payload;
      return next();
    } catch {
      // invalid token — fall through to guest
    }
  }
  req.user = { userId: GUEST_USER_ID, email: "guest@engwrite.local" };
  next();
}
