const ApiError = require('../utils/ApiError');

/**
 * Validates req.body against a Joi schema. Usage:
 *   router.post('/', validate(schema), controller.create)
 */
function validate(schema) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => d.message);
      return next(new ApiError(400, 'Validation failed', details));
    }

    req.body = value;
    next();
  };
}

module.exports = validate;
