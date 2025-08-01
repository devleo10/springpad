import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route";
import { AuthService } from "./services/auth.service";

// Load environment variables
dotenv.config();

// Import Firebase config (this will initialize Firebase)
import "./config/firebase";

const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"] // Replace with your production domain
        : ["http://localhost:3000", "http://localhost:3001"], // Local development
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/v1/user", userRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    code: "NOT_FOUND",
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Global error:", err);

  // Handle specific error types
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      error: "File too large",
      code: "FILE_TOO_LARGE",
      message: "The uploaded file exceeds the size limit",
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON",
      code: "INVALID_JSON",
      message: "Request body contains invalid JSON",
    });
  }

  // Default error response
  res.status(500).json({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message || "Internal error",
  });
});

const port = process.env.PORT || 4000;

// Graceful shutdown
const server = app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 Health check: http://localhost:${port}/health`);
});

// Cleanup expired sessions every hour
setInterval(async () => {
  try {
    await AuthService.cleanupExpiredSessions();
  } catch (error) {
    console.error("Failed to cleanup expired sessions:", error);
  }
}, 60 * 60 * 1000);

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("✅ Process terminated");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("✅ Process terminated");
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 Unhandled Rejection at:", promise, "reason:", reason);
  // Don't exit in development
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("🚨 Uncaught Exception:", error);
  process.exit(1);
});

export default app;
