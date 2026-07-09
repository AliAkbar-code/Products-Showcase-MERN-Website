import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Package, CheckCircle, XCircle, Loader2, User, Mail, Building, MessageSquare, Calendar } from 'lucide-react';
import api from '../../utils/api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    name: '',
    email: '',
    company: '',
    comment: ''
  });
  const [reviewSubmitStatus, setReviewSubmitStatus] = useState(null);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        // Fetch current product
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.data);
        
        // Fetch related products from same category
        if (data.data.category && data.data.category._id) {
          const relatedResponse = await api.get(`/products?category=${data.data.category._id}&limit=4`);
          const filteredProducts = relatedResponse.data.data.filter(p => p._id !== data.data._id);
          setRelatedProducts(filteredProducts);
        }

        // Fetch reviews for this product
        try {
          const reviewsResponse = await api.get(`/products/${id}/reviews`);
          setReviews(reviewsResponse.data.data || []);
        } catch (reviewErr) {
          console.log('No reviews found or error fetching reviews');
          setReviews([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndRelated();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewSubmitStatus(null);

    try {
      const response = await api.post(`/products/${id}/reviews`, reviewForm);
      setReviews([response.data.data, ...reviews]);
      setReviewSubmitStatus({ type: 'success', message: 'Your review has been submitted and will be visible after approval.' });
      setReviewForm({
        rating: 5,
        name: '',
        email: '',
        company: '',
        comment: ''
      });
    } catch (err) {
      setReviewSubmitStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to submit review. Please try again.' 
      });
    } finally {
      setReviewLoading(false);
    }
  };

  const handleRatingClick = (rating) => {
    setReviewForm(prev => ({ ...prev, rating }));
  };

  if (loading) return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '6rem 20px', background: '#ffffff'
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      >
        <Loader2 size={48} color="#1976d2" />
      </motion.div>
      <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading product details...</p>
    </div>
  );

  if (error) return (
    <div style={{
      padding: '4rem 20px', textAlign: 'center', background: '#ffffff'
    }}>
      <div style={{
        maxWidth: '500px', margin: '0 auto', background: '#fef2f2',
        borderRadius: '16px', padding: '3rem', border: '1px solid #fecaca'
      }}>
        <XCircle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
        <p style={{ color: '#991b1b', fontSize: '1.1rem', fontWeight: 600 }}>{error}</p>
        <Link to="/products" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          marginTop: '1.5rem', color: '#1976d2', fontWeight: 600,
          textDecoration: 'none'
        }}>
          <ArrowLeft size={16} /> Back to Products
        </Link>
      </div>
    </div>
  );

  if (!product) return null;

  const imgUrl = product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`;

  // Build specs list in specific order
  const specs = [];
  
  if (product.brand) specs.push({ label: 'Brand', value: product.brand });
  if (product.modelNumber) specs.push({ label: 'Model', value: product.modelNumber });
  if (product.type) specs.push({ label: 'Type', value: product.type });
  if (product.printSpeed) specs.push({ label: 'Print Speed', value: product.printSpeed });
  if (product.duplexPrinting !== undefined) specs.push({ label: 'Duplex Printing', value: product.duplexPrinting ? 'Yes' : 'No' });
  if (product.adf !== undefined) specs.push({ label: 'ADF', value: product.adf ? 'Yes' : 'No' });
  if (product.colorSupport !== undefined) specs.push({ label: 'Color', value: product.colorSupport ? 'Yes (Color)' : 'No (Mono)' });
  if (product.connectivity && product.connectivity.length > 0) specs.push({ label: 'Connectivity', value: product.connectivity.join(', ') });
  if (product.paperSizeSupported && product.paperSizeSupported.length > 0) specs.push({ label: 'Paper Sizes', value: product.paperSizeSupported.join(', ') });
  if (product.trolley !== undefined) specs.push({ label: 'Trolley', value: product.trolley ? 'Yes' : 'No' });
  if (product.extraTray !== undefined) specs.push({ label: 'Extra Tray', value: product.extraTray ? 'Yes' : 'No' });
  if (product.monthlyDutyCycle) specs.push({ label: 'Monthly Duty Cycle', value: `${product.monthlyDutyCycle.toLocaleString()} pages` });
  if (product.warranty) specs.push({ label: 'Warranty', value: product.warranty });
  if (product.condition) specs.push({ label: 'Condition', value: product.condition });
  if (product.stock !== undefined) specs.push({ label: 'Stock', value: product.stock > 0 ? `${product.stock} available` : 'Out of Stock' });

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{
        background: '#ffffff', borderBottom: '1px solid #e5e5e5',
        padding: '12px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link
            to="/products"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              color: '#9e9e9e', fontWeight: 500, textDecoration: 'none',
              fontSize: '0.875rem', transition: 'color 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#1976d2'}
            onMouseLeave={e => e.currentTarget.style.color = '#9e9e9e'}
          >
            <ArrowLeft size={14} />
            Back to Products
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ maxWidth: '1200px', margin: '16px auto', padding: '0 16px' }}
      >
        {/* Top Section - Image Left, Info Right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          background: '#ffffff',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '16px'
        }}>
          {/* Left - Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              position: 'relative',
              backgroundColor: '#ffffff',
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              padding: '20px'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px'
            }}>
              <img
                src={imgUrl}
                alt={product.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'contain'
                }}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; }}
              />
            </div>
            {product.featured && (
              <div style={{
                position: 'absolute', top: '12px', left: '12px',
                background: '#1976d2', color: 'white',
                padding: '4px 12px', borderRadius: '4px',
                fontSize: '0.75rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                <Star size={12} /> Featured
              </div>
            )}
          </motion.div>

          {/* Right - Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Category */}
            <div style={{ marginBottom: '12px' }}>
              <span style={{
                display: 'inline-block',
                color: '#1976d2',
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {product.category?.name || 'Uncategorized'}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
              fontWeight: 600,
              color: '#212121',
              marginBottom: '8px',
              lineHeight: 1.4
            }}>
              {product.name}
            </h1>

            {/* Product Model */}
            {product.modelNumber && (
              <p style={{
                fontSize: '0.875rem',
                color: '#757575',
                marginBottom: '12px'
              }}>
                Model: {product.modelNumber}
              </p>
            )}

            {/* Rating Display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill={star <= averageRating ? '#fbbf24' : 'none'}
                    color={star <= averageRating ? '#fbbf24' : '#d1d5db'}
                  />
                ))}
              </div>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#212121'
              }}>
                {averageRating > 0 ? averageRating : '0.0'}
              </span>
              <span style={{
                fontSize: '0.75rem',
                color: '#9e9e9e'
              }}>
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#1976d2'
              }}>
                {product.price > 0 ? `₨ ${product.price.toLocaleString()}` : 'Call for Price'}
              </span>
              {product.stock > 0 && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginLeft: '12px',
                  color: '#00a650',
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}>
                  <CheckCircle size={12} /> In Stock
                </span>
              )}
              {product.stock === 0 && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginLeft: '12px',
                  color: '#dc2626',
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}>
                  <XCircle size={12} /> Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <div style={{
              background: '#fafafa',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              <p style={{
                color: '#616161',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                margin: 0
              }}>
                {product.description}
              </p>
            </div>

            {/* Contact Button */}
            <div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/contact"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: '#1976d2',
                    color: 'white',
                    border: 'none',
                    padding: '14px 24px',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1565c0'}
                  onMouseLeave={e => e.currentTarget.style.background = '#1976d2'}
                >
                  Contact Us for This Product
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Product Specifications */}
        {specs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '16px'
            }}
          >
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#212121',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: `2px solid #1976d2`,
              display: 'inline-block'
            }}>
              Product Specifications
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '0'
            }}>
              {specs.map((spec, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr',
                  borderBottom: i < specs.length - 1 ? '1px solid #f0f0f0' : 'none',
                  fontSize: '0.875rem'
                }}>
                  <div style={{
                    fontWeight: 500,
                    color: '#757575',
                    padding: '12px 16px',
                    background: '#fafafa'
                  }}>
                    {spec.label}
                  </div>
                  <div style={{
                    color: '#212121',
                    padding: '12px 16px',
                    background: '#ffffff'
                  }}>
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Customer Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            background: '#ffffff',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '16px'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '2px solid #1976d2'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#212121',
              margin: 0
            }}>
              Customer Reviews
            </h3>
            
            {/* Rating Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill={star <= averageRating ? '#fbbf24' : 'none'}
                    color={star <= averageRating ? '#fbbf24' : '#d1d5db'}
                  />
                ))}
              </div>
              <span style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#212121'
              }}>
                {averageRating > 0 ? averageRating : '0.0'}
              </span>
              <span style={{
                fontSize: '0.75rem',
                color: '#9e9e9e'
              }}>
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div style={{ marginBottom: '24px' }}>
              {reviews.slice(0, 5).map((review, index) => (
                <div key={review._id || index} style={{
                  padding: '16px',
                  borderBottom: index < Math.min(reviews.length, 5) - 1 ? '1px solid #f0f0f0' : 'none'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    marginBottom: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#1976d2',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}>
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: '#212121' }}>
                          {review.name}
                        </span>
                        {review.company && (
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#9e9e9e',
                            marginLeft: '4px'
                          }}>
                            ({review.company})
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          fill={star <= review.rating ? '#fbbf24' : 'none'}
                          color={star <= review.rating ? '#fbbf24' : '#d1d5db'}
                        />
                      ))}
                      <span style={{
                        fontSize: '0.7rem',
                        color: '#9e9e9e',
                        marginLeft: '4px'
                      }}>
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <p style={{
                    margin: '6px 0 0 40px',
                    color: '#616161',
                    fontSize: '0.875rem',
                    lineHeight: 1.5
                  }}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '24px',
              color: '#9e9e9e'
            }}>
              <MessageSquare size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          )}

          {/* Leave a Review Form */}
          <div style={{
            borderTop: '1px solid #f0f0f0',
            paddingTop: '20px',
            marginTop: '8px'
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#212121',
              marginBottom: '16px'
            }}>
              Leave a Review
            </h4>

            {reviewSubmitStatus && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '4px',
                marginBottom: '16px',
                background: reviewSubmitStatus.type === 'success' ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${reviewSubmitStatus.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                color: reviewSubmitStatus.type === 'success' ? '#166534' : '#991b1b'
              }}>
                {reviewSubmitStatus.message}
              </div>
            )}

            <form onSubmit={handleReviewSubmit}>
              {/* Rating */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 500,
                  color: '#374151',
                  fontSize: '0.875rem',
                  marginBottom: '6px'
                }}>
                  Your Rating *
                </label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <Star
                        size={28}
                        fill={star <= reviewForm.rating ? '#fbbf24' : 'none'}
                        color={star <= reviewForm.rating ? '#fbbf24' : '#d1d5db'}
                      />
                    </button>
                  ))}
                  <span style={{
                    marginLeft: '8px',
                    fontSize: '0.875rem',
                    color: '#9e9e9e',
                    alignSelf: 'center'
                  }}>
                    {reviewForm.rating}/5
                  </span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '16px'
              }}>
                {/* Name */}
                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: 500,
                    color: '#374151',
                    fontSize: '0.875rem',
                    marginBottom: '6px'
                  }}>
                    Your Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9e9e9e'
                    }} />
                    <input
                      type="text"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your name"
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        border: '1px solid #e5e5e5',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = '#1976d2'}
                      onBlur={e => e.currentTarget.style.borderColor = '#e5e5e5'}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: 500,
                    color: '#374151',
                    fontSize: '0.875rem',
                    marginBottom: '6px'
                  }}>
                    Your Email *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9e9e9e'
                    }} />
                    <input
                      type="email"
                      value={reviewForm.email}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        border: '1px solid #e5e5e5',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = '#1976d2'}
                      onBlur={e => e.currentTarget.style.borderColor = '#e5e5e5'}
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: 500,
                    color: '#374151',
                    fontSize: '0.875rem',
                    marginBottom: '6px'
                  }}>
                    Company (Optional)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building size={18} style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9e9e9e'
                    }} />
                    <input
                      type="text"
                      value={reviewForm.company}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Enter your company"
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        border: '1px solid #e5e5e5',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = '#1976d2'}
                      onBlur={e => e.currentTarget.style.borderColor = '#e5e5e5'}
                    />
                  </div>
                </div>
              </div>

              {/* Review Comment */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 500,
                  color: '#374151',
                  fontSize: '0.875rem',
                  marginBottom: '6px'
                }}>
                  Write your review *
                </label>
                <div style={{ position: 'relative' }}>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your experience with this product..."
                    required
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'border-color 0.2s',
                      fontFamily: 'inherit'
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = '#1976d2'}
                    onBlur={e => e.currentTarget.style.borderColor = '#e5e5e5'}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={reviewLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  padding: '12px 32px',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: reviewLoading ? 'not-allowed' : 'pointer',
                  opacity: reviewLoading ? 0.7 : 1,
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => {
                  if (!reviewLoading) e.currentTarget.style.background = '#1565c0';
                }}
                onMouseLeave={e => {
                  if (!reviewLoading) e.currentTarget.style.background = '#1976d2';
                }}
              >
                {reviewLoading ? (
                  <>
                    <Loader2 size={18} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </motion.button>

              <p style={{
                marginTop: '8px',
                fontSize: '0.75rem',
                color: '#9e9e9e'
              }}>
                Your review will be visible after approval.
              </p>
            </form>
          </div>
        </motion.div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              padding: '24px'
            }}
          >
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#212121',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: `2px solid #1976d2`,
              display: 'inline-block'
            }}>
              Related Products
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {relatedProducts.map((relatedProduct) => {
                const relatedImgUrl = relatedProduct.image.startsWith('http') 
                  ? relatedProduct.image 
                  : `http://localhost:5000${relatedProduct.image}`;
                
                return (
                  <motion.div
                    key={relatedProduct._id}
                    whileHover={{ y: -5, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Link 
                      to={`/product/${relatedProduct._id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div style={{
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '180px',
                          overflow: 'hidden'
                        }}>
                          <img
                            src={relatedImgUrl}
                            alt={relatedProduct.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain'
                            }}
                            onError={(e) => { 
                              e.target.onerror = null; 
                              e.target.src = 'https://via.placeholder.com/200x200?text=No+Image'; 
                            }}
                          />
                        </div>
                        
                        <div>
                          <h4 style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#212121',
                            marginBottom: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.4,
                            minHeight: '2.8rem'
                          }}>
                            {relatedProduct.name}
                          </h4>
                          
                          <div style={{
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: '#1976d2',
                            marginBottom: '8px'
                          }}>
                            {relatedProduct.price > 0 ? `₨ ${relatedProduct.price.toLocaleString()}` : 'Call for Price'}
                          </div>
                          
                          {relatedProduct.stock > 0 ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#00a650',
                              fontSize: '0.7rem',
                              fontWeight: 500
                            }}>
                              <CheckCircle size={10} /> In Stock
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#dc2626',
                              fontSize: '0.7rem',
                              fontWeight: 500
                            }}>
                              <XCircle size={10} /> Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Add spinner animation style */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}