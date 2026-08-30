const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

/**
 * Global error handler. Normalises ApiError, Mongoose validation errors,
 * Mongoose duplicate-key errors, and anything unexpected into one
 * consistent JSON response shape.
 */
function errorHandler(err, req, res, _next) {
  let statusCode = err instanceof ApiError ? err.statusCode : 500;
  let message = err.message || 'Internal server error';
  let details = err instanceof ApiError ? err.details : undefined;

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => e.message);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field
      ? `A record with this ${field} already exists`
      : 'Duplicate record';
  }

  logger.error(`${req.method} ${req.originalUrl} -> ${statusCode} ${message}`, {
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    statusCode,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
    message,
    ...(details ? { details } : {}),
  });
}

module.exports = errorHandler;
