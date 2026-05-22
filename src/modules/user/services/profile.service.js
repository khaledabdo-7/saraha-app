import { compare, compareSync, hashSync } from "bcrypt";
import User from "../../../models/user.model.js";
import { decryption } from "../../../utils/encryption.utils.js";
import BlacklistToken from "../../../models/blacklistToken.model.js";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import { AppError } from "../../../utils/appError.js";
import { emitter } from "../../../services/sendEmail.service.js";

export const getProfileData = async (userData) => {
  const user = userData;

  if (!user) {
    throw new AppError("User data not found", 404);
  }

  if (user.phone) {
    user.phone = await decryption({
      cypher: user.phone,
      secretKey: process.env.ENCRYPTED_KEY,
    });
  }
  return user;
};

export const updatePassword = async (userData) => {
  const {
    _id,
    oldPassword,
    newPassword,
    confirmedNewPassword,
    accessToken,
    refreshToken,
  } = userData;

  if (newPassword !== confirmedNewPassword) {
    throw new AppError("Password and confirmed new password do not match", 400);
  }
  const user = await User.findById(_id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const isPasswordMatched = compareSync(oldPassword, user.password);
  if (!isPasswordMatched) {
    throw new AppError("Invalid old password", 400);
  }

  user.password = hashSync(newPassword, Number(process.env.SALT) || 10);
  await user.save();

  try {
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET_LOGIN);
    const decodedRefresh = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH,
    );
    await BlacklistToken.insertMany([
      {
        tokenId: decodedToken.jti,
        expiryDate: decodedToken.exp,
      },
      {
        tokenId: decodedRefresh.jti,
        expiryDate: decodedRefresh.exp,
      },
    ]);
  } catch (error) {
    throw new AppError("Invalid token or session expired", 401);
  }
};

export const updateProfileData = async (userData) => {
  const { email, username, displayName, phone, _id, protocol, host } = userData;
  const user = await User.findById(_id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (email && email !== user.email) {
    const isEmailExist = await User.findOne({ email: email });
    if (isEmailExist) {
      throw new AppError("Email already exists", 409);
    }
    user.email = email;
    user.isEmailVerified = false;

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    const confirmedEmailLink = `${protocol}://${host}/auth/verify/${token}`;
    emitter.emit("SendEmail", {
      to: email,
      subject: "Verify your email",
      html: `<h1>Verify your email</h1><a href="${confirmedEmailLink}">Click to verify</a>`,
    });
  }
  if (username && username !== user.username) {
    const isUsernameExist = await User.findOne({ username: username });
    if (isUsernameExist) {
      throw new AppError("Username already exists", 409);
    }
    user.username = username;
  }
  if (displayName) {
    user.displayName = displayName;
  }
  if (phone) {
    user.phone = CryptoJS.AES.encrypt(
      phone,
      process.env.ENCRYPTED_KEY,
    ).toString();
  }
  await user.save();
  return user;
};

export const getPublicProfileService = async (username) => {
  const user = await User.findOne({
    username: username,
    isDeleted: false,
  }).select("username displayName profileImage");

  if (!user) {
    throw new AppError("User not found or account is inactive", 404);
  }
  return user;
};

export const softDeleteUser = async (userData) => {
  const { password, userId } = userData;
  const user = await User.findById({ id: accessToken.id });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const passwordMatch = await compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError("Invalid password", 400);
  }
  user.isDeleted = true;
  await user.save();
  return user;
};
