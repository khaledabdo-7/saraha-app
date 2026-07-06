import User from "../../../models/user.model.js";
import bcrypt, { compareSync, hashSync } from "bcrypt";
import CryptoJS from "crypto-js";
import { encryption } from "../../../utils/encryption.utils.js";
import {
  emitter,
  sendEmailService,
} from "../../../services/sendEmail.service.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import BlacklistToken from "../../../models/blacklistToken.model.js";
import { AppError } from "../../../utils/appError.js";
import { OAuth2Client } from "google-auth-library";
import { provider } from "../../../constants/constants.js";
import { client } from "../../../database/redis.connection.js";

export const registerUser = async (userData) => {
  const {
    username,
    displayName,
    email,
    password,
    phone,
    age,
    confirmedPassword,
    host,
    protocol,
  } = userData;

  if (password !== confirmedPassword) {
    throw new AppError("Password and confirmed password do not match", 400);
  }
  const existEmail = await User.findOne({ email: email });
  if (existEmail) {
    throw new AppError("Email already exists", 409);
  }
  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
  const encryptedPhone = await encryption({
    value: phone,
    secretKey: process.env.ENCRYPTED_KEY,
  });
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
  const confirmedEmailLink = `${protocol}://${host}/auth/verify/${token}`;
  emitter.emit("SendEmail", {
    to: email,
    subject: "Verify your email",
    html: `<h1>Verify your email</h1>
    <a href="${confirmedEmailLink}">Click to verify</a>`,
  });
  const user = await User.create({
    username,
    displayName,
    email,
    password: hashedPassword,
    phone: encryptedPhone,
    age,
  });
  if (!user) {
    throw new AppError("Created user failed, try again later", 500);
  }

  return user;
};

export const login = async (userData) => {
  const { email, password } = userData;
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AppError("Invalid email or password", 400);
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError("Invalid email or password", 400);
  }
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_LOGIN, {
    expiresIn: "1h",
    jwtid: uuidv4(),
  });
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET_REFRESH,
    {
      expiresIn: "2d",
      jwtid: uuidv4(),
    },
  );
  return { user, accessToken, refreshToken };
};

export const verifyEmail = async (userData) => {
  const { token } = userData;
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOneAndUpdate(
      { email: decodedData.email },
      { isEmailVerified: true },
      { new: true },
    );
    if (!user) {
      throw new AppError("Invalid email", 400);
    }
    return user;
  } catch (error) {
    throw new AppError(error.message || "Invalid or expired token", 400);
  }
};

export const resendVerificationLink = async (userData) => {
  const { email, protocol, host } = userData;
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (user.isEmailVerified === true) {
    throw new AppError("Already verified", 400);
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
  const confirmedEmailLink = `${protocol}://${host}/auth/verify/${token}`;
  emitter.emit("SendEmail", {
    to: email,
    subject: "Verify your email",
    html: `<h1>Verify your email</h1>
    <a href="${confirmedEmailLink}">Click to verify</a>`,
  });
};

export const refreshToken = async (userData) => {
  const { refreshToken } = userData;
  try {
    const decodedData = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH,
    );

    const accessToken = jwt.sign(
      { id: decodedData.id },
      process.env.JWT_SECRET_LOGIN,
      {
        expiresIn: "1h",
        jwtid: uuidv4(),
      },
    );
    return accessToken;
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 401);
  }
};

// export const logoutService = async (userData) => {
//   const { accessToken, refreshToken } = userData;

//   const getPayload = (token, secret) => {
//     try {
//       return jwt.verify(token, secret);
//     } catch (error) {
//       if (error.name === "TokenExpiredError") {
//         return jwt.decode(token);
//       }
//       throw new AppError("Invalid token", 401);
//     }
//   };

//   const decodedToken = getPayload(accessToken, process.env.JWT_SECRET_LOGIN);
//   const decodedRefreshToken = getPayload(
//     refreshToken,
//     process.env.JWT_SECRET_REFRESH,
//   );

//   await BlacklistToken.insertMany([
//     {
//       tokenId: decodedToken.jti,
//       expiryDate: decodedToken.exp,
//     },
//     {
//       tokenId: decodedRefreshToken.jti,
//       expiryDate: decodedRefreshToken.exp,
//     },
//   ]);
// };

export const logoutRedisService = async (userData) => {
  const { accessToken, refreshToken } = userData;
  const getPayload = (token, secret) => {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return jwt.decode(token);
      }
      throw new AppError("Invalid token", 401);
    }
  };

  const decodedToken = getPayload(accessToken, process.env.JWT_SECRET_LOGIN);
  const decodedRefreshToken = getPayload(
    refreshToken,
    process.env.JWT_SECRET_REFRESH,
  );

  const nowInSeconds = Math.floor(Date.now() / 1000);

  const accessTokenTTL = decodedToken.exp - nowInSeconds;
  const refreshTokenTTL = decodedRefreshToken.exp - nowInSeconds;

  if (accessTokenTTL > 0) {
    await client.set(`blacklist:${decodedToken.jti}`, "true", {
      EX: accessTokenTTL,
    });
  }

  if (refreshTokenTTL > 0) {
    await client.set(`blacklist:${decodedRefreshToken.jti}`, "true", {
      EX: refreshTokenTTL,
    });
  }
};

export const forgetPassword = async (userData) => {
  const { email } = userData;
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AppError("This email is not registered", 404);
  }
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  emitter.emit("SendEmail", {
    to: email,
    subject: "Update your password",
    html: `<h1>Update your password</h1>
    <p>This is your OTP ${otp}</p>`,
  });

  const hashedOtp = hashSync(otp, Number(process.env.SALT));
  user.otp = hashedOtp;
  await user.save();
};

export const resetPassword = async (userData) => {
  const { email, password, confirmedPassword, otp } = userData;

  if (!otp) {
    throw new AppError("OTP is required", 400);
  }
  if (password !== confirmedPassword) {
    throw new AppError("Password and confirmed password do not match", 400);
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AppError("This email is not registered", 404);
  }
  const isOtpMatched = compareSync(otp.toString(), user.otp);
  if (!isOtpMatched) {
    throw new AppError("Invalid OTP", 400);
  }

  user.password = hashSync(password, Number(process.env.SALT));
  user.otp = undefined;
  await user.save();
};

export const gmailLoginService = async (idToken) => {
  const client = OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { email_verified, email, name } = payload;
  if (!email_verified) {
    throw new AppError("invalid email credential", 400);
  }

  const user = await User.findOne({ email, provider: provider.GOOGLE });
  if (!user) {
    user = await User.create({
      username: name,
      email,
      provider: provider.GOOGLE,
      isEmailVerified: true,
    });
  }

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_LOGIN, {
    expiresIn: "3h",
    jwtid: uuidv4(),
  });
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET_REFRESH,
    {
      expiresIn: "2d",
      jwtid: uuidv4(),
    },
  );
  return { user, accessToken, refreshToken };
};
// http://localhost:3007/auth/verify/${email}

// {
//     "message": "Login successfully",
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMDFkOTQwZmVkMjM4NmI1MTMxMTE3ZCIsImlhdCI6MTc3ODUwNzA5NCwiZXhwIjoxNzc4NTEwNjk0fQ.MBf6VnBGvSt--rJacColf4a825dl1m75vxpqwblXTEE",
//     "user": {
//         "id": "6a01d940fed2386b5131117d",
//         "username": "khaledabdo_7",
//         "email": "kabdo5250@gmail.com"
//     }
// }
