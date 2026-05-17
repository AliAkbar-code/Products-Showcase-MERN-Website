const { body } = require('express-validator');

const createProductRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Category must be a valid ID'),

  body('brand')
    .trim()
    .notEmpty().withMessage('Brand is required'),

  body('modelNumber')
    .trim()
    .notEmpty().withMessage('Model Number is required'),

  body('type')
    .trim()
    .notEmpty().withMessage('Type is required')
    .isIn(['Copier', 'Mfp', 'printer', 'IT equipment']).withMessage('Type must be Copier, Mfp, printer, or IT equipment'),

  body('colorSupport')
    .notEmpty().withMessage('Color support is required')
    .isBoolean().withMessage('Color support must be a boolean'),


  body('condition')
    .trim()
    .notEmpty().withMessage('Condition is required')
    .isIn(['New', 'Used', 'Refurbished']).withMessage('Condition must be New, Used, or Refurbished'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),


  body('monthlyDutyCycle')
    .optional()
    .isInt({ min: 0 }).withMessage('Monthly duty cycle must be a non-negative integer'),
];

const updateProductRules = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Product name cannot be empty')
    .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Description cannot be empty')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('category')
    .optional()
    .trim()
    .notEmpty().withMessage('Category cannot be empty')
    .isMongoId().withMessage('Category must be a valid ID'),

  body('brand')
    .optional()
    .trim()
    .notEmpty().withMessage('Brand cannot be empty'),

  body('modelNumber')
    .optional()
    .trim()
    .notEmpty().withMessage('Model Number cannot be empty'),

  body('type')
    .optional()
    .trim()
    .isIn(['Copier', 'Mfp', 'printer', 'IT equipment']).withMessage('Type must be Copier, Mfp, printer, or IT equipment'),

  body('colorSupport')
    .optional()
    .isBoolean().withMessage('Color support must be a boolean'),


  body('condition')
    .optional()
    .trim()
    .isIn(['New', 'Used', 'Refurbished']).withMessage('Condition must be New, Used, or Refurbished'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),


  body('monthlyDutyCycle')
    .optional()
    .isInt({ min: 0 }).withMessage('Monthly duty cycle must be a non-negative integer'),
];

module.exports = {
  validateCreateProduct: createProductRules,
  validateUpdateProduct: updateProductRules
};
