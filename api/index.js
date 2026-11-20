import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { databaseConnection } from "../src/database/connection.js";
import { redisConnection } from "../src/database/redis.connection.js";
import authRouter from "../src/modules/auth/auth.controller.js";
import userRouter from "../src/modules/user/user.controller.js";
import messageRouter from "../src/modules/message/message.controller.js";
import { globalErrorHandler } from "../src/middlewares/errorHandler.middleware.js";

const app = express();

app.set("trust proxy", 1);
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Cached DB connection for serverless
let dbPromise = null;
app.use(async (req, res, next) => {
  if (!dbPromise) {
    dbPromise = Promise.all([
      databaseConnection(),
      redisConnection()
    ]).catch(err => {
      console.error("Serverless DB connection error:", err);
      dbPromise = null;
    });
  }
  await dbPromise;
  next();
});

// Root Healthcheck
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "صَارَحَـنِي Backend API is live on Vercel! 🚀",
    timestamp: new Date().toISOString()
  });
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);

app.use(globalErrorHandler);

export default app;
