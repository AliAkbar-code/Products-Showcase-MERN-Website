const { body } = require('express-validator');

const createCategoryRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ max: 50 }).withMessage('Category name cannot exceed 50 characters'),

  body('description')
    .optional()
    .trim(),
];

const updateCategoryRules = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Category name cannot be empty')
    .isLength({ max: 50 }).withMessage('Category name cannot exceed 50 characters'),

  body('description')
    .optional()
    .trim(),
];

module.exports = {
  validateCreateCategory: createCategoryRules,
  validateUpdateCategory: updateCategoryRules
};
