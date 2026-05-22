export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  console.error("Global Error Handler Caught:", err.stack);
  return res.status(statusCode).json({
    status: "error",
    message: message,
  });
};
