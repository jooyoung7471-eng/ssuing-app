import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "../types";
import { AppError } from "./errorHandler";

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("FATAL: JWT_SECRET must be set in production environment!");
  }
  console.warn("WARNING: JWT_SECRET is not set. Using default dev secret. Set JWT_SECRET in production!");
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-DO-NOT-USE-IN-PRODUCTION";
const GUEST_USER_ID = "guest-user-00000000";
const prisma = new PrismaClient();

const ensuredDevices = new Set<string>();

async function ensureGuestUser(deviceId?: string) {
  const userId = deviceId ? `guest-${deviceId}` : GUEST_USER_ID;
  if (ensuredDevices.has(userId)) return userId;
  try {
    const email = `guest-${deviceId || "default"}@engwrite.local`;
    const hashedGuestPassword = await bcrypt.hash("guest-no-login-allowed", 10);
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email, password: hashedGuestPassword },
    });
    ensuredDevices.add(userId);
  } catch (err) {
    // DB 에러 시에도 userId는 반환 (다음 요청에서 재시도)
    console.warn("Guest user setup:", (err as Error).message);
  }
  return userId;
}
// Ensure legacy guest user exists
setTimeout(() => ensureGuestUser(), 2000);

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

export async function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
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
  const deviceId = req.headers["x-device-id"] as string | undefined;
  // CRITICAL: User row를 await로 확보해야 자식 row(UserStats 등)의 FK upsert가 안전.
  // 이전엔 fire-and-forget이라 첫 요청 race로 P2003 발생 → 컨테이너 crash → Railway 정지.
  const userId = await ensureGuestUser(deviceId);
  req.user = { userId, email: `guest-${deviceId || "default"}@engwrite.local` };
  next();
}
