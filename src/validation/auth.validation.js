import Joi from "joi";

export const signupSchema = {
  body: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    displayName: Joi.string().min(1).max(50),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "edu"] },
      })
      .required(),
    password: Joi.string()
      .min(4)
      .max(50)
      .required(),
    confirmedPassword: Joi.string().valid(Joi.ref("password")).required(),
    phone: Joi.string()
      .pattern(/^01[0125][0-9]{8}$/)
      .required(),
    age: Joi.number().min(14).max(80).required(),
  }),
};

export const loginSchema = {
  body: Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "edu"] },
      })
      .required(),
    password: Joi.string()
      .min(4)
      .max(50)
      .required(),
  }),
};

export const forgetPasswordSchema = {
  body: Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "edu"] },
      })
      .required(),
  }),
};

export const resetPasswordSchema = {
  body: Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "edu"] },
      })
      .required(),
    password: Joi.string()
      .min(4)
      .max(50)
      .required(),
    confirmedPassword: Joi.string().valid(Joi.ref("password")).required(),
    otp: Joi.string().length(4).required(),
  }),
};

export const resendVerificationSchema = {
  body: Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "edu"] },
      })
      .required(),
  }),
};
