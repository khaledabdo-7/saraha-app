import Joi from "joi";

export const sendMessageSchema = {
  body: Joi.object({
    title: Joi.string().required(),
    ownerId: Joi.string().required(),
  }),
};

export const deleteMessageSchema = {
  params: Joi.object({
    messageId: Joi.string().hex().length(24).required(),
  }),
};
