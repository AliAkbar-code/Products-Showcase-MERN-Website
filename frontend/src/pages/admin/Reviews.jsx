// pages/admin/Reviews.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Trash2, 
  Filter, 
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageSquare,
  User,
  Mail,
  Calendar,
  TrendingUp,
  TrendingDown,
  Award
} from 'lucide-react';
import api from '../../utils/api';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, approved, pending, featured
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, featured: 0 });
  const [expandedReview, setExpandedReview] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const itemsPerPage = 10;

  useEffect(() => {
    fetchReviews();
  }, [filter, currentPage]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
      });

      if (filter === 'pending') params.append('isApproved', 'false');
      else if (filter === 'approved') params.append('isApproved', 'true');
      else if (filter === 'featured') params.append('isFeatured', 'true');

      if (searchTerm) params.append('search', searchTerm);

      const response = await api.get(`/admin/reviews?${params}`);
      setReviews(response.data.data);
      setTotalPages(response.data.pagination.pages);
      setTotalReviews(response.data.pagination.total);

      // Calculate stats from fetched data or fetch separately
      calculateStats();
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = async () => {
    try {
      // Fetch all reviews for stats
      const allResponse = await api.get('/admin/reviews?limit=1000');
      const allReviews = allResponse.data.data;
      
      setStats({
        total: allReviews.length,
        pending: allReviews.filter(r => !r.isApproved).length,
        approved: allReviews.filter(r => r.isApproved).length,
        featured: allReviews.filter(r => r.isFeatured).length,
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReviews();
  };

  const handleApprove = async (reviewId, currentStatus) => {
    setActionLoading(prev => ({ ...prev, [reviewId]: true }));
    try {
      await api.patch(`/admin/reviews/${reviewId}/approve`, { 
        isApproved: !currentStatus 
      });
      await fetchReviews();
      await calculateStats();
    } catch (error) {
      console.error('Error updating review:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleToggleFeatured = async (reviewId, currentStatus) => {
    setActionLoading(prev => ({ ...prev, [reviewId]: true }));
    try {
      await api.patch(`/admin/reviews/${reviewId}/feature`, { 
        isFeatured: !currentStatus 
      });
      await fetchReviews();
      await calculateStats();
    } catch (error) {
      console.error('Error toggling featured:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    setActionLoading(prev => ({ ...prev, [reviewId]: true }));
    try {
      await api.delete(`/admin/reviews/${reviewId}`);
      await fetchReviews();
      await calculateStats();
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const toggleExpand = (reviewId) => {
    setExpandedReview(expandedReview === reviewId ? null : reviewId);
  };

  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= rating ? '#fbbf24' : 'none'}
            color={star <= rating ? '#fbbf24' : '#d1d5db'}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            color: '#212121',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <MessageSquare size={28} color="#1976d2" />
            Reviews Management
          </h1>
          <p style={{ color: '#757575', margin: '4px 0 0' }}>
            Manage and moderate customer reviews for your products
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: '#ffffff',
          padding: '16px 20px',
          borderRadius: '8px',
          border: '1px solid #e5e5e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#9e9e9e', fontWeight: 500, margin: 0 }}>Total Reviews</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212121', margin: '4px 0 0' }}>{stats.total}</p>
          </div>
          <MessageSquare size={24} color="#1976d2" />
        </div>

        <div style={{
          background: '#ffffff',
          padding: '16px 20px',
          borderRadius: '8px',
          border: '1px solid #e5e5e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#9e9e9e', fontWeight: 500, margin: 0 }}>Pending Approval</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b', margin: '4px 0 0' }}>{stats.pending}</p>
          </div>
          <Clock size={24} color="#f59e0b" />
        </div>

        <div style={{
          background: '#ffffff',
          padding: '16px 20px',
          borderRadius: '8px',
          border: '1px solid #e5e5e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#9e9e9e', fontWeight: 500, margin: 0 }}>Approved</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#00a650', margin: '4px 0 0' }}>{stats.approved}</p>
          </div>
          <CheckCircle size={24} color="#00a650" />
        </div>

        <div style={{
          background: '#ffffff',
          padding: '16px 20px',
          borderRadius: '8px',
          border: '1px solid #e5e5e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#9e9e9e', fontWeight: 500, margin: 0 }}>Featured</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6', margin: '4px 0 0' }}>{stats.featured}</p>
          </div>
          <Award size={24} color="#8b5cf6" />
        </div>
      </div>

      {/* Filters and Search */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        padding: '16px',
        background: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e5e5e5'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setFilter('all'); setCurrentPage(1); }}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: filter === 'all' ? '2px solid #1976d2' : '1px solid #e5e5e5',
              background: filter === 'all' ? '#1976d2' : 'transparent',
              color: filter === 'all' ? '#ffffff' : '#757575',
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            All
          </button>
          <button
            onClick={() => { setFilter('pending'); setCurrentPage(1); }}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: filter === 'pending' ? '2px solid #f59e0b' : '1px solid #e5e5e5',
              background: filter === 'pending' ? '#f59e0b' : 'transparent',
              color: filter === 'pending' ? '#ffffff' : '#757575',
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Pending
          </button>
          <button
            onClick={() => { setFilter('approved'); setCurrentPage(1); }}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: filter === 'approved' ? '2px solid #00a650' : '1px solid #e5e5e5',
              background: filter === 'approved' ? '#00a650' : 'transparent',
              color: filter === 'approved' ? '#ffffff' : '#757575',
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Approved
          </button>
          <button
            onClick={() => { setFilter('featured'); setCurrentPage(1); }}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: filter === 'featured' ? '2px solid #8b5cf6' : '1px solid #e5e5e5',
              background: filter === 'featured' ? '#8b5cf6' : 'transparent',
              color: filter === 'featured' ? '#ffffff' : '#757575',
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ⭐ Featured
          </button>
        </div>

        <form onSubmit={handleSearch} style={{ 
          display: 'flex', 
          gap: '8px',
          marginLeft: 'auto',
          flex: '1',
          maxWidth: '400px'
        }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reviews..."
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #e5e5e5',
              borderRadius: '4px',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#1976d2'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              background: '#1976d2',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1565c0'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#1976d2'}
          >
            <Search size={16} />
            Search
          </button>
        </form>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e5e5'
        }}>
          <Loader2 size={40} color="#1976d2" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '16px', color: '#757575' }}>Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e5e5'
        }}>
          <MessageSquare size={48} color="#d1d5db" />
          <p style={{ marginTop: '12px', color: '#9e9e9e', fontSize: '1.1rem' }}>
            No reviews found
          </p>
          <p style={{ color: '#b0b0b0', fontSize: '0.875rem' }}>
            {filter === 'pending' ? 'All reviews are approved' : 'No reviews submitted yet'}
          </p>
        </div>
      ) : (
        <div style={{
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e5e5',
          overflow: 'hidden'
        }}>
          {reviews.map((review, index) => (
            <div
              key={review._id}
              style={{
                padding: '16px 20px',
                borderBottom: index < reviews.length - 1 ? '1px solid #f0f0f0' : 'none',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-start' }}>
                {/* Left: Review Info */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
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
                      <span style={{ fontWeight: 600, color: '#212121' }}>{review.name}</span>
                      {review.company && (
                        <span style={{ fontSize: '0.75rem', color: '#9e9e9e', marginLeft: '4px' }}>
                          ({review.company})
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '4px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {renderStars(review.rating)}
                    <span style={{ fontSize: '0.75rem', color: '#9e9e9e' }}>
                      <Mail size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {review.email}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9e9e9e' }}>
                      <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    <p style={{
                      color: '#616161',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      margin: 0,
                      display: expandedReview === review._id ? 'block' : '-webkit-box',
                      WebkitLineClamp: expandedReview === review._id ? 'none' : 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {review.comment}
                    </p>
                    {review.comment.length > 100 && (
                      <button
                        onClick={() => toggleExpand(review._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#1976d2',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          padding: '4px 0',
                          fontWeight: 500
                        }}
                      >
                        {expandedReview === review._id ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>

                  {/* Product Info */}
                  {review.product && (
                    <div style={{
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.75rem',
                      color: '#9e9e9e',
                      background: '#f5f5f5',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      width: 'fit-content'
                    }}>
                      <span>📦</span>
                      <span>{review.product.name || review.product.modelNumber || 'Product'}</span>
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginLeft: 'auto'
                }}>
                  {/* Status Badges */}
                  <div style={{ display: 'flex', gap: '4px', marginRight: '8px' }}>
                    {review.isApproved ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 10px',
                        borderRadius: '12px',
                        background: '#f0fdf4',
                        color: '#00a650',
                        fontSize: '0.7rem',
                        fontWeight: 500
                      }}>
                        <CheckCircle size={12} /> Approved
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 10px',
                        borderRadius: '12px',
                        background: '#fef3c7',
                        color: '#f59e0b',
                        fontSize: '0.7rem',
                        fontWeight: 500
                      }}>
                        <Clock size={12} /> Pending
                      </span>
                    )}
                    {review.isFeatured && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 10px',
                        borderRadius: '12px',
                        background: '#f3e8ff',
                        color: '#8b5cf6',
                        fontSize: '0.7rem',
                        fontWeight: 500
                      }}>
                        <Award size={12} /> Featured
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {!review.isApproved && (
                    <button
                      onClick={() => handleApprove(review._id, review.isApproved)}
                      disabled={actionLoading[review._id]}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: 'none',
                        background: '#00a650',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: actionLoading[review._id] ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        opacity: actionLoading[review._id] ? 0.7 : 1,
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (!actionLoading[review._id]) e.currentTarget.style.background = '#008545';
                      }}
                      onMouseLeave={(e) => {
                        if (!actionLoading[review._id]) e.currentTarget.style.background = '#00a650';
                      }}
                    >
                      {actionLoading[review._id] ? (
                        <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                      Approve
                    </button>
                  )}

                  {review.isApproved && (
                    <button
                      onClick={() => handleToggleFeatured(review._id, review.isFeatured)}
                      disabled={actionLoading[review._id]}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: 'none',
                        background: review.isFeatured ? '#8b5cf6' : '#e5e5e5',
                        color: review.isFeatured ? '#ffffff' : '#757575',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: actionLoading[review._id] ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        opacity: actionLoading[review._id] ? 0.7 : 1,
                        transition: 'all 0.2s'
                      }}
                    >
                      {actionLoading[review._id] ? (
                        <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <Award size={14} />
                      )}
                      {review.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(review._id)}
                    disabled={actionLoading[review._id]}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: '1px solid #fecaca',
                      background: 'transparent',
                      color: '#dc2626',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: actionLoading[review._id] ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      opacity: actionLoading[review._id] ? 0.7 : 1,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!actionLoading[review._id]) {
                        e.currentTarget.style.background = '#fef2f2';
                        e.currentTarget.style.borderColor = '#dc2626';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!actionLoading[review._id]) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = '#fecaca';
                      }
                    }}
                  >
                    {actionLoading[review._id] ? (
                      <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#757575' }}>
                Showing {reviews.length} of {totalReviews} reviews
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '4px',
                    background: 'transparent',
                    color: currentPage === 1 ? '#d1d5db' : '#757575',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    style={{
                      padding: '6px 12px',
                      border: currentPage === i + 1 ? '2px solid #1976d2' : '1px solid #e5e5e5',
                      borderRadius: '4px',
                      background: currentPage === i + 1 ? '#1976d2' : 'transparent',
                      color: currentPage === i + 1 ? '#ffffff' : '#757575',
                      fontWeight: currentPage === i + 1 ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '4px',
                    background: 'transparent',
                    color: currentPage === totalPages ? '#d1d5db' : '#757575',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}

// Add Clock component if not imported
const Clock = ({ size, color }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);