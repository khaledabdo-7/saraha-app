import mongoose from "mongoose";

const url = process.env.DB_URL;

export const databaseConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB connected successfully using Mongoose");
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
};
