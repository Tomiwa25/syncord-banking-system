const Joi = require('joi');

const createAccountSchema = Joi.object({
  customerId: Joi.string().hex().length(24).required(),
});

module.exports = { createAccountSchema };
