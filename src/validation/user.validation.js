import Joi from "joi";

export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    newPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    confirmedNewPassword: Joi.string().valid(Joi.ref("newPassword")),
    refreshToken: Joi.string().required(),
  }),
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
};

export const updateProfileSchema = {
  body: Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    displayName: Joi.string().min(1).max(30),
    phone: Joi.string()
      .pattern(/^01[0125][0-9]{8}$/)
      .required(),
  }),
};

export const getPublicProfileSchema = {
  params: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
  }),
};

export const softDeleteSchema = {
  body: Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  }),
};
