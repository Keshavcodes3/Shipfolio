import express from "express";
import cors from "cors";
import helmet from "helmet";
// import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware.js";
import { globalRateLimiter } from "./middleware/rate-limit.middleware.js";
import { requestId } from "./middleware/request-id.middleware.js";

import authRoutes from "./modules/auth/routes/auth.routes.js";
import userRoutes from "./modules/users/routes/users.routes.js";
import projectRoutes from "./modules/projects/routes/projects.routes.js";
import githubRoutes from "./modules/github/routes/github.routes.js";
import profileRoutes from "./modules/profiles/routes/profiles.routes.js";
import activityRoutes from "./modules/activity/routes/activity.routes.js";
import technologyRoutes from "./modules/technologies/routes/technologies.routes.js";
import followRoutes from "./modules/follows/routes/follows.routes.js";
import communityRoutes from "./modules/community/routes/community.routes.js";
import graveyardRoutes from "./modules/Graveyard/graveyard.routes.js";
import educationRoutes from "./modules/education/routes/education.routes.js";
import experienceRoutes from "./modules/experience/routes/experience.routes.js";
import notificationRoutes from "./modules/notifications/routes/notifications.routes.js";

export const createApp = () => {
  const app = express();

  // Global middleware
  app.use(helmet());
  app.use(requestId);
  // app.use(compression());
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowed = [
          env.CORS_ORIGIN,
          'http://localhost:5173',
          'http://localhost:3000',
        ]
        if (!origin || allowed.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'), false)
        }
      },
      credentials: true,
    })
  );
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(cookieParser());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(globalRateLimiter);

  // Health
  app.get("/health", (_req, res) => {
    res.json({ success: true, message: "ShipFolio API is running", uptime: process.uptime() });
  });

  app.get(`${env.API_PREFIX}/health`, (_req, res) => {
    res.json({ success: true, message: "ShipFolio API is running" });
  });

  // Readiness — checks DB + Redis
  app.get(`${env.API_PREFIX}/ready`, async (_req, res) => {
    const checks: Record<string, string> = {};

    // Database check
    try {
      const { prisma } = await import("./config/database.js");
      await prisma.$queryRaw`SELECT 1`;
      checks.database = "ok";
    } catch {
      checks.database = "down";
    }

    // Redis check
    try {
      const { redis } = await import("./config/redis.js");
      if (redis.status === "ready") {
        await redis.ping();
        checks.redis = "ok";
      } else {
        checks.redis = "down";
      }
    } catch {
      checks.redis = "down";
    }

    const healthy = Object.values(checks).every((v) => v === "ok");
    res.status(healthy ? 200 : 503).json({
      success: healthy,
      checks,
    });
  });

  // Module routes
  app.use(`${env.API_PREFIX}/auth`, authRoutes);
  app.use(`${env.API_PREFIX}/users`, userRoutes);
  app.use(`${env.API_PREFIX}/projects`, projectRoutes);
  app.use(`${env.API_PREFIX}/github`, githubRoutes);
  app.use(`${env.API_PREFIX}/profiles`, profileRoutes);
  app.use(`${env.API_PREFIX}/activities`, activityRoutes);
  app.use(`${env.API_PREFIX}/technologies`, technologyRoutes);
  app.use(`${env.API_PREFIX}/follows`, followRoutes);
  app.use(`${env.API_PREFIX}/community`, communityRoutes);
  app.use(`${env.API_PREFIX}/graveyard`, graveyardRoutes);
  app.use(`${env.API_PREFIX}/education`, educationRoutes);
  app.use(`${env.API_PREFIX}/experience`, experienceRoutes);
  app.use(`${env.API_PREFIX}/notifications`, notificationRoutes);

  // 404 & error
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};

export default createApp;
