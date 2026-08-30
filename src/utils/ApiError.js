/**
 * Standard error type used across the app so the error middleware can
 * always respond with a consistent shape. Throw `new ApiError(404, "...")`
 * from anywhere (routes, services, the NIBSS client) and it will be caught
 * by express-async-errors + the global error handler.
 */
class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
