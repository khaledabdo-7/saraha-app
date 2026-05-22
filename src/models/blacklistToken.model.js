import mongoose, { Schema, model } from "mongoose";

const blacklistTokenSchema = new Schema(
  {
    tokenId: {
      type: String,
      required: true,
      unique: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const BlacklistToken =
  mongoose.models.BlacklistToken ||
  model("BlacklistToken", blacklistTokenSchema);
export default BlacklistToken;
