import { Router } from "express";
import * as userService from "./services/profile.service.js";
import { authentication } from "../../middlewares/auth.middleware.js";
import { validationSchema } from "../../middlewares/validation.middleware.js";
import {
  getPublicProfileSchema,
  softDeleteSchema,
  updatePasswordSchema,
  updateProfileSchema,
} from "../../validation/user.validation.js";

const userRouter = Router();

userRouter.get("/profile", authentication(), async (req, res, next) => {
  try {
    const processedUser = await userService.getProfileData(
      req.loggedInUser.toObject(),
    );
    return res.status(200).json({
      processedUser: {
        email: processedUser.email,
        phone: processedUser.phone,
        name: processedUser.name,
        displayName: processedUser.displayName,
        age: processedUser.age,
      },
    });
  } catch (error) {
    next(error);
  }
});

userRouter.get(
  "/public-profile/:username",
  validationSchema(getPublicProfileSchema),
  async (req, res, next) => {
    try {
      const { username } = req.params;
      const userProfile = await userService.getPublicProfileService({
        username,
      });
      return res.status(200).json({ userProfile });
    } catch (error) {
      next(error);
    }
  },
);

userRouter.patch(
  "/update-password",
  validationSchema(updatePasswordSchema),
  authentication(),
  async (req, res, next) => {
    try {
      const accessToken = req.headers.authorization?.split(" ")[1];
      const { refreshToken } = req.body;

      const userData = {
        ...req.body,
        _id: req.loggedInUser._id,
        accessToken,
        refreshToken,
      };

      await userService.updatePassword(userData);
      return res.status(200).json({
        message: "Password updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

userRouter.put(
  "/update-profile",
  validationSchema(updateProfileSchema),
  authentication(),
  async (req, res, next) => {
    try {
      const userData = {
        ...req.body,
        _id: req.loggedInUser._id,
        protocol: req.protocol,
        host: req.get("host"),
      };

      const updatedUser = await userService.updateProfileData(userData);

      return res.status(200).json({
        message: "Profile updated successfully",
        user: {
          username: updatedUser.username,
          email: updatedUser.email,
          displayName: updatedUser.displayName,
          isEmailVerified: updatedUser.isEmailVerified,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

userRouter.patch(
  "/soft-delete",
  validationSchema(softDeleteSchema),
  authentication(),
  async (req, res, next) => {
    try {
      const userData = {
        password: req.body.password,
        userId: loggedInUser._id,
      };
      await userService.softDeleteUser(userData);
      return res.status(200).json({
        message: "Account deactivated successfully (Soft Deleted)",
      });
    } catch (error) {
      next(error);
    }
  },
);
export default userRouter;
