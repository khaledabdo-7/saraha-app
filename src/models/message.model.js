import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const messageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderId: {
  type: Schema.Types.ObjectId,
  ref: "User",
}
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.models.Message || model("Message", messageSchema);

export default Message;
