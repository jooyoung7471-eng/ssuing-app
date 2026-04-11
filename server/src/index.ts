import express from "express";
import cors from "cors";
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
    allowedHeaders: ["Content-Type", "Authorization"],
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
