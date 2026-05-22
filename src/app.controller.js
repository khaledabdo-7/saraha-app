import { databaseConnection } from "./database/connection.js";
import express from "express";
import authRouter from "./modules/auth/auth.controller.js";
import { compare } from "bcrypt";
import userRouter from "./modules/user/user.controller.js";
import { globalErrorHandler } from "./middlewares/errorHandler.middleware.js";
import messageRouter from "./modules/message/message.controller.js";

export const bootstrap = async () => {
  const app = express();
  const port = process.env.PORT;
  app.use(express.json());

  await databaseConnection();
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/message", messageRouter);

  app.use(globalErrorHandler);
  app.listen(port, () => {
    console.log(`server is running in port ${port}`);
  });
};
