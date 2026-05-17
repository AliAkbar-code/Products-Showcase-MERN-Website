const crypto = require('crypto');
const Admin = require('../models/Admin');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

// Helper to send token response
const sendTokenResponse = (admin, statusCode, res) => {
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });

  res.status(statusCode).json({
    success: true,
    token
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
      return next(new ErrorResponse('Username already registered', 400));
    }

    const admin = await Admin.create({ username, password });
    sendTokenResponse(admin, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(new ErrorResponse('Please provide a username and password', 400));
    }

    const admin = await Admin.findOne({ username }).select('+password');
    if (!admin) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(admin, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  // In a token-based system without server-side blacklist, logout is client-side.
  // But we send a response anyway.
  res.status(200).json({
    success: true,
    data: {}
  });
};

exports.getProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ username: req.body.username });
    if (!admin) {
      return next(new ErrorResponse('There is no admin with that username', 404));
    }

    const resetToken = admin.getResetPasswordToken();
    await admin.save({ validateBeforeSave: false });

    // In a real application, send this via email.
    // For this demonstration, we'll return the token in the API response.
    res.status(200).json({
      success: true,
      message: 'Reset token generated (simulating email send). Use this token in reset-password endpoint.',
      data: resetToken
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const admin = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!admin) {
      return next(new ErrorResponse('Invalid or expired reset token', 400));
    }

    admin.password = req.body.password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();
    sendTokenResponse(admin, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('+password');

    if (!(await admin.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse('Password is incorrect', 401));
    }

    admin.password = req.body.newPassword;
    await admin.save();
    sendTokenResponse(admin, 200, res);
  } catch (error) {
    next(error);
  }
};
