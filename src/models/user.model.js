import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import { systemRoles,provider } from "../constants/constants.js";


const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, "Username already taken"],
      lowercase: true,
      trim: true,
      minLength: [3, "Username must be at least 3 characters long"],
      maxLength: [20, "Username must be at most 3 characters long"],
    },
    displayName: {
      type: String,
      default: "Unknown",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already taken"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    profileImage: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    age: {
      type: Number,
      required: true,
      min: [18, "You must be at least 18 years old to register"],
      max: [100, "You must be at most 100 years old to register"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(systemRoles),
      default: systemRoles.USER,
    },
    provider: {
    type: String,
    enum: Object.values(provider),
    default: provider.SYSTEM,
  },
    otp: String,
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || model("User", userSchema);

export default User;
