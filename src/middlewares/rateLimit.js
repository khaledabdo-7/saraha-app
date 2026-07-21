import { rateLimit } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { client } from "../database/redis.connection.js";
export const limiter = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message: {
      status: 429,
      message:
        "Too many requests from this IP, please try again after 15 minutes",
    },
    standardHeaders: "draft-7",
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args) => client.sendCommand(args),
    }),
  });
};
