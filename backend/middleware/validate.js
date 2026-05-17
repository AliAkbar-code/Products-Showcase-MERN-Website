const { validationResult } = require('express-validator');

/**
 * Generic middleware that checks express-validator results.
 * If validation fails, returns a 400 with joined error messages.
 * Place this AFTER your validation rules in the middleware chain.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map(e => e.msg).join(', ');
    return res.status(400).json({
      success: false,
      message
    });
  }
  next();
};

module.exports = validate;
