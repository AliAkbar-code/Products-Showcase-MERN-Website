// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Product review routes
router.get('/products/:productId/reviews', reviewController.getProductReviews);
router.post('/products/:productId/reviews', reviewController.createReview);

// Admin routes for managing reviews
router.get('/admin/reviews', reviewController.getAllReviews);
router.patch('/admin/reviews/:id/approve', reviewController.approveReview);
router.patch('/admin/reviews/:id/feature', reviewController.toggleFeatured);
router.delete('/admin/reviews/:id', reviewController.deleteReview);

module.exports = router;