import { Router } from "express";
import * as authService from "./services/authentication.service.js";
import { validationSchema } from "../../middlewares/validation.middleware.js";
import {
  forgetPasswordSchema,
  loginSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  signupSchema,
} from "../../validation/auth.validation.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validationSchema(signupSchema),
  async (req, res, next) => {
    try {
      const userData = {
        ...req.body,
        protocol: req.protocol,
        host: req.headers.host,
      };
      const user = await authService.registerUser(userData);
      return res.status(201).json({
        message: "User created successfully",
        user,
      });
    } catch (error) {
      next(error);
    }
  },
);

authRouter.post(
  "/login",
  validationSchema(loginSchema),
  async (req, res, next) => {
    try {
      const { user, accessToken, refreshToken } = await authService.login(
        req.body,
      );

      return res.status(200).json({
        message: "Login successfully",
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

authRouter.post(
  "/resend-verify",
  validationSchema(resendVerificationSchema),
  async (req, res, next) => {
    try {
      const userData = {
        email: req.body.email,
        protocol: req.protocol,
        host: req.get("host"),
      };

      await authService.resendVerificationLink(userData);

      return res.status(200).json({
        message: "Verification link resent successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

authRouter.get("/verify/:token", async (req, res, next) => {
  try {
    const user = await authService.verifyEmail(req.params);
    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = await req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    const { accessToken } = await authService.refreshToken(req.body);
    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/revoke-token", async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    const { refreshToken } = req.body;
    if (!accessToken || !refreshToken) {
      return res.status(400).json({ message: "Tokens are required" });
    }
    await authService.logoutService({
      accessToken,
      refreshToken,
    });
    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
});

authRouter.patch(
  "/forget-password",
  validationSchema(forgetPasswordSchema),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      await authService.forgetPassword({ email });
      return res.status(200).json({
        message: "OTP sent successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

authRouter.patch(
  "/reset-password",
  validationSchema(resetPasswordSchema),
  async (req, res, next) => {
    try {
      const userData = req.body;
      await authService.resetPassword(userData);
      return res.status(200).json({
        message: "Password updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);
export default authRouter;
