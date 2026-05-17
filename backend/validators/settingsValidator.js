const { body } = require('express-validator');

const updateSettingsRules = [
  body('storeName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Store name cannot exceed 100 characters'),

  body('heroTitle')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Hero title cannot exceed 200 characters'),

  body('heroSubtitle')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Hero subtitle cannot exceed 500 characters'),

  body('heroButtonText')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Hero button text cannot exceed 50 characters'),

  body('aboutUs')
    .optional()
    .trim(),

  body('contactEmail')
    .optional()
    .trim(),

  body('contactPhone')
    .optional()
    .trim(),

  body('address')
    .optional()
    .trim(),

  body('socialLinks.facebook')
    .optional()
    .trim(),

  body('socialLinks.instagram')
    .optional()
    .trim(),

  body('socialLinks.twitter')
    .optional()
    .trim(),

  body('socialLinks.whatsapp')
    .optional()
    .trim(),

  body('footerText')
    .optional()
    .trim(),

  body('announcement.enabled')
    .optional()
    .isBoolean().withMessage('Announcement enabled must be a boolean'),

  body('announcement.text')
    .optional()
    .trim(),
];

module.exports = {
  validateUpdateSettings: updateSettingsRules
};
