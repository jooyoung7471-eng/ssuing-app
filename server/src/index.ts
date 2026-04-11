import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import sentenceRoutes from "./routes/sentences";
import correctionRoutes from "./routes/corrections";
import historyRoutes from "./routes/history";
import gamificationRoutes from "./routes/gamification";
import reviewRoutes from "./routes/review";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sentences", sentenceRoutes);
app.use("/api/corrections", correctionRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/review", reviewRoutes);

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
