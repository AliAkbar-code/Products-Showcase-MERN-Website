const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const Admin = require('../models/Admin');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.admin = await Admin.findById(decoded.id);

    if (!req.admin) {
      return next(new ErrorResponse('Administator not found', 401));
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ErrorResponse('Token expired', 401));
    }
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};
