const jwt = require('jsonwebtoken');
const config = require('../config');
const ApiError = require('../utils/ApiError');

/**
 * Authenticates *consumers of this backend's own API* via a bearer JWT
 * issued by POST /api/v1/auth/login. This is separate from whatever auth
 * NibssByPhoenix requires for its own API (handled inside the
 * nibssPhoenixClient).
 */
function requireAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Missing or malformed Authorization header'));
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret);
    req.user = payload;
    next();
  } catch (err) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
}

module.exports = requireAuth;
