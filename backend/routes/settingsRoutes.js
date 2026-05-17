const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');
const { validateUpdateSettings } = require('../validators/settingsValidator');
const validate = require('../middleware/validate');

const router = express.Router();

router.route('/')
  .get(getSettings)
  .put(protect, validateUpdateSettings, validate, updateSettings);

module.exports = router;
