import { Router } from "express";
import * as messageService from "./services/message.service.js";
import { authentication } from "../../middlewares/auth.middleware.js";
import { validationSchema } from "../../middlewares/validation.middleware.js";
import {
  sendMessageSchema,
  deleteMessageSchema,
} from "../../validation/message.validation.js";

const messageRouter = Router();

messageRouter.post(
  "/send-message",
  validationSchema(sendMessageSchema),
  authentication(),
  async (req, res, next) => {
    try {
      const messageData = {
        ...req.body,
        senderId: req.loggedInUser._id,
      };
      await messageService.sendMessageService(messageData);
      return res.status(201).json({
        message: "Message sent anonymously successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

messageRouter.get("/my-messages", authentication(), async (req, res, next) => {
  try {
    const ownerId = req.loggedInUser._id;

    const messages = await messageService.getMessagesService(ownerId);

    return res.status(200).json({
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    next(error);
  }
});

messageRouter.delete(
  "/:messageId",
  authentication(),
  validationSchema(deleteMessageSchema),
  async (req, res, next) => {
    try {
      const data = {
        messageId: req.params.messageId,
        ownerId: req.loggedInUser._id,
      };

      await messageService.deleteMessageService(data);

      return res.status(200).json({
        message: "Message deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);
export default messageRouter;
