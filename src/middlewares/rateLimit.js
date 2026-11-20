import { rateLimit } from "express-rate-limit";

export const limiter = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per 15 minutes
    message: {
      status: 429,
      message:
        "Too many requests from this IP, please try again after 15 minutes",
    },
    standardHeaders: "draft-7",
    legacyHeaders: false,
  });
};
