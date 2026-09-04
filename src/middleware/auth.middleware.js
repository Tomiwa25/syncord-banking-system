const jwt = require('jsonwebtoken');
const env = require('../config/env');

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to perform this action",
    });
  }

  next();
};

exports.authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      })
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found"
      });
    }

    const decoded = jwt.verify(
      token,
      env.jwt.secret
    );
    req.user = decoded;
    next();
  } catch(error) {
    return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
  }
};

exports.authorizeRoles = authorizeRoles;
