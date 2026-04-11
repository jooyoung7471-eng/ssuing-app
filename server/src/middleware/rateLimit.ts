import { Request, Response, NextFunction } from "express";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function rateLimit(options: {
  windowMs: number;
  maxRequests: number;
  message?: string;
}) {
  const { windowMs, maxRequests, message = "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const key = `${ip}:${req.path}`;
    const now = Date.now();

    const entry = store.get(key);

    if (!entry || now > entry.resetTime) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    entry.count++;

    if (entry.count > maxRequests) {
      res.status(429).json({
        error: { code: "RATE_LIMITED", message },
      });
      return;
    }

    next();
  };
}

// Preset: strict rate limit for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10,
  message: "로그인 시도가 너무 많습니다. 15분 후 다시 시도해주세요.",
});

// Preset: general API rate limit
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60,
});

// Preset: LLM endpoint rate limit (expensive calls)
export const llmRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  message: "교정 요청이 너무 많습니다. 1분 후 다시 시도해주세요.",
});
