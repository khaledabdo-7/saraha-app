import { AppError } from "../utils/appError.js";

export const validationSchema = (schema) => {
  return (req, res, next) => {
    const schemaKeys = Object.keys(schema);
    let validationErrors = [];

    for (const key of schemaKeys) {
      if (schema[key]) {
        const { error } = schema[key].validate(req[key], {
          abortEarly: false,
        });

        if (error) {
          error.details.forEach((err) => {
            validationErrors.push(err.message);
          });
        }
      }
    }
    if (validationErrors.length > 0) {
      return next(new AppError(validationErrors.join(", "), 400));
    }

    next();
  };
};
