const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');
const { validateCreateCategory, validateUpdateCategory } = require('../validators/categoryValidator');

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, upload.single('image'), validateCreateCategory, validate, createCategory);

router.route('/:id')
  .get(validateObjectId, getCategory)
  .put(validateObjectId, protect, upload.single('image'), validateUpdateCategory, validate, updateCategory)
  .delete(validateObjectId, protect, deleteCategory);

module.exports = router;
