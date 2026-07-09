// controllers/reviewController.js
const Review = require('../models/Review');
const Product = require('../models/Product');

// Get all reviews for a product (approved only for public)
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, totalCount, ratingStats] = await Promise.all([
      Review.find({ product: productId, isApproved: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Review.countDocuments({ product: productId, isApproved: true }),
      Review.getAverageRating(productId)
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount / parseInt(limit))
      },
      rating: {
        average: ratingStats.averageRating || 0,
        count: ratingStats.count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, name, email, company, comment } = req.body;

    // Validate required fields
    if (!rating || !name || !email || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: rating, name, email, comment'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Create review
    const review = await Review.create({
      product: productId,
      rating,
      name,
      email,
      company: company || '',
      comment
    });

    // If this is the first review or we want to auto-approve, we could set isApproved: true
    // For now, we'll keep it as pending approval

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review submitted successfully. It will be visible after approval.'
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
};

// Admin: Get all reviews with pagination and filtering
exports.getAllReviews = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      isApproved, 
      productId,
      search 
    } = req.query;

    const filter = {};
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';
    if (productId) filter.product = productId;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, totalCount] = await Promise.all([
      Review.find(filter)
        .populate('product', 'name modelNumber price image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Review.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Admin: Approve a review
exports.approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.isApproved = isApproved !== undefined ? isApproved : true;
    await review.save();

    // If approved, we might want to update product's rating stats here
    // Or we can use a middleware/cron job for that

    res.status(200).json({
      success: true,
      data: review,
      message: `Review ${review.isApproved ? 'approved' : 'unapproved'} successfully`
    });
  } catch (error) {
    console.error('Error approving review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// Admin: Toggle featured status
exports.toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.isFeatured = isFeatured !== undefined ? isFeatured : !review.isFeatured;
    await review.save();

    res.status(200).json({
      success: true,
      data: review,
      message: `Review featured status updated to ${review.isFeatured}`
    });
  } catch (error) {
    console.error('Error toggling featured:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update featured status',
      error: error.message
    });
  }
};

// Admin: Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};