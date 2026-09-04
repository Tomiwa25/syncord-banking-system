const errorMiddleware = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode
    || err.response?.status
    || (err.name === 'ValidationError' || err.name === 'CastError' ? 400 : undefined)
    || (err.code === 11000 ? 409 : 500);
  const providerMessage = err.response?.data?.message;
  const message = statusCode >= 500
    ? "Internal Server Error"
    : err.code === 11000
      ? "A record with one of these values already exists"
      : providerMessage || err.message || "Request failed";

  res.status(statusCode).json({
    success: false,
    message,
  });
};
module.exports = errorMiddleware;
