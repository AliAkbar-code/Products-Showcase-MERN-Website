const mongoose = require('mongoose');

/**
 * Middleware to validate that req.params.id is a valid MongoDB ObjectId.
 * Prevents Mongoose CastError from propagating as unhandled 500 errors.
 */
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  next();
};

module.exports = validateObjectId;
