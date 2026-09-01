const Joi = require('joi');

const onboardSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  middleName: Joi.string().optional(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().length(11).pattern(/^\d+$/).required().messages({
    'string.length': 'phoneNumber must be a valid 11-digit number',
    'string.pattern.base': 'phoneNumber must contain only digits',
  }),
  bvn: Joi.string().length(11).pattern(/^\d+$/).required().messages({
    'string.length': 'bvn must be exactly 11 digits',
    'string.pattern.base': 'bvn must contain only digits',
  }),
  dateOfBirth: Joi.string().isoDate().required(),
  address: Joi.string().required(),
  gender: Joi.string().optional(),
  password: Joi.string().min(8).required(),
});

// bvn and password are intentionally excluded from updates — bvn
// shouldn't change post-onboarding, and password changes deserve their
// own dedicated (and better-secured) endpoint.
const updateSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  middleName: Joi.string(),
  email: Joi.string().email(),
  phoneNumber: Joi.string().length(11).pattern(/^\d+$/),
  dateOfBirth: Joi.string().isoDate(),
  address: Joi.string(),
  gender: Joi.string(),
}).min(1);

module.exports = { onboardSchema, updateSchema };
