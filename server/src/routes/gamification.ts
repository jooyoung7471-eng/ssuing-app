import { Router, Request, Response, NextFunction } from "express";
import { optionalAuthMiddleware } from "../middleware/auth";
import { getStats, getAchievements, getWeeklyReport } from "../services/gamification";

const router = Router();

// GET /api/gamification/stats
router.get("/stats", optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const stats = await getStats(userId);
    res.json({ data: stats });
  } catch (err) {
    next(err);
  }
});

// GET /api/gamification/achievements
router.get("/achievements", optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const achievements = await getAchievements(userId);
    res.json({ data: achievements });
  } catch (err) {
    next(err);
  }
});

// GET /api/gamification/weekly-report
router.get("/weekly-report", optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const report = await getWeeklyReport(userId);
    res.json({ data: report });
  } catch (err) {
    next(err);
  }
});

export default router;
