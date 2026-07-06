import { client } from "../database/redis.connection.js";
import BlacklistToken from "../models/blacklistToken.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authentication = () => {
  return async (req, res, next) => {
    try {
      let accessToken;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
      ) {
        accessToken = req.headers.authorization.split(" ")[1];
      }

      if (!accessToken) {
        return res.status(401).json({ message: "You are not logged in!" });
      }

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_LOGIN);

      const isTokenBlacklisted = await client.get(`blacklist:${decoded.jti}`);

      if (isTokenBlacklisted) {
        return res.status(401).json({
          message: "Please login first",
        });
      }
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        return res.status(401).json({ message: "The user no longer exists." });
      }

      req.loggedInUser = currentUser;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid token or expired",
        error: error.message,
      });
    }
  };
};

export const authorization = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const role = req.loggedInUser.role;
      if (!role) {
        return res.status(401).json({
          message: "Please login first",
        });
      }
      const isRoleExist = allowedRoles.includes(role);
      if (!isRoleExist) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  };
};
