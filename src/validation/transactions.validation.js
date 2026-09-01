const Joi = require('joi');

const nameEnquirySchema = Joi.object({
  accountNumber: Joi.string().required(),
  bankCode: Joi.string().min(3).max(10).required(),
});

const transferSchema = Joi.object({
  sourceAccountNumber: Joi.string().required(),
  destinationAccountNumber: Joi.string().required(),
  destinationBankCode: Joi.string().min(3).max(10).required(),
  amount: Joi.number().positive().required(),
  narration: Joi.string().required(),
});

module.exports = { nameEnquirySchema, transferSchema };
