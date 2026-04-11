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

let guestUserEnsured = false;
async function ensureGuestUser() {
  if (guestUserEnsured) return;
  try {
    const existing = await prisma.user.findUnique({ where: { id: GUEST_USER_ID } });
    if (!existing) {
      const hashedGuestPassword = await bcrypt.hash("guest-no-login-allowed", 10);
      await prisma.user.create({
        data: { id: GUEST_USER_ID, email: "guest@engwrite.local", password: hashedGuestPassword },
      });
    }
    guestUserEnsured = true;
  } catch (err) {
    console.warn("Guest user setup deferred:", (err as Error).message);
  }
}
// Defer guest user creation to avoid crash if DB isn't ready at import time
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
