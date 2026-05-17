const express = require('express');
const {
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// Public signup removed for security — use `node createAdmin.js` to create admins
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/change-password', protect, changePassword);

module.exports = router;
