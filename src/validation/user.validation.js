import Joi from "joi";

export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string().min(4).max(50).required(),
    newPassword: Joi.string().min(4).max(50).required(),
    confirmedNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
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
        tlds: { allow: ["com", "net", "org", "edu"] },
      }),
    username: Joi.string().alphanum().min(3).max(30),
    displayName: Joi.string().min(1).max(50),
    phone: Joi.string()
      .pattern(/^01[0125][0-9]{8}$/),
  }),
};

export const getPublicProfileSchema = {
  params: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
  }),
};

export const softDeleteSchema = {
  body: Joi.object({
    password: Joi.string().min(4).max(50).required(),
  }),
};
