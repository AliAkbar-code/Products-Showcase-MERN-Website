const express = require('express');
const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');
const { validateCreateProduct, validateUpdateProduct } = require('../validators/productValidator');

const router = express.Router();

router.get('/featured', getFeaturedProducts);

router.route('/')
  .get(getProducts)
  .post(protect, upload.single('image'), validateCreateProduct, validate, createProduct);

router.route('/:id')
  .get(validateObjectId, getProduct)
  .put(validateObjectId, protect, upload.single('image'), validateUpdateProduct, validate, updateProduct)
  .delete(validateObjectId, protect, deleteProduct);

module.exports = router;
