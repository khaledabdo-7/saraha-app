import Message from "../../../models/message.model.js";
import User from "../../../models/user.model.js";
import { AppError } from "../../../utils/appError.js";
import jwt from "jsonwebtoken";

export const sendMessageService = async (messageData) => {
  const { title, ownerId, senderId } = messageData;
  if (!title) {
    throw new AppError("Title is required", 400);
  }
  if (!ownerId) {
    throw new AppError("ownerId is required", 400);
  }
  const owner = await User.findById(ownerId);
  if (!owner) {
    throw new AppError("Receiver not found", 404);
  }

  const newMessage = await Message.create({ title, ownerId, senderId });

  return newMessage;
};
// check if title and ownerId
// check if receiver is exist from body

export const getMessagesService = async (ownerId) => {
  const messages = await Message.find({ ownerId })
    .select("-senderId")
    .populate([
      {
        path: "ownerId",
        select: " -password -__v ",
      },
    ]);
  return messages;
};

export const deleteMessageService = async (data) => {
  const { messageId, ownerId } = data;

  const message = await Message.findById(messageId);
  if (!message) {
    throw new AppError("Message not found", 404);
  }

  if (message.ownerId.toString() !== ownerId.toString()) {
    throw new AppError("You are not authorized to delete this message", 403);
  }

  await Message.findByIdAndDelete(messageId);
};
