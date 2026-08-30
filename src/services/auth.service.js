const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const customersService = require('./customers.service');
const ApiError = require('../utils/ApiError');

/**
 * NOTE: This authenticates *staff/API consumers* of this backend
 * (i.e. who can call your onboarding/account/transaction endpoints),
 * which is separate from any auth NibssByPhoenix itself requires for
 * its own API (handled inside nibssPhoenixClient).
 */
async function login({ email, password }) {
  const customer = await customersService.findByEmailWithPassword(email);

  if (!customer || !customer.passwordHash) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, customer.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const payload = { sub: customer._id.toString(), email: customer.email, role: 'customer' };
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  return {
    accessToken,
    customer: {
      id: customer._id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
    },
  };
}

module.exports = { login };
