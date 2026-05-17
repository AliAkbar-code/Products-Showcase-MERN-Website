import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Package, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../utils/api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        // Fetch current product
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.data);
        
        // Fetch related products from same category
        if (data.data.category && data.data.category._id) {
          const relatedResponse = await api.get(`/products?category=${data.data.category._id}&limit=4`);
          // Filter out the current product
          const filteredProducts = relatedResponse.data.data.filter(p => p._id !== data.data._id);
          setRelatedProducts(filteredProducts);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndRelated();
  }, [id]);

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
  
  // Order: Brand, Model, Type, Print Speed, Duplex, ADF, Color, Connectivity, Paper Sizes, and then others
  if (product.brand) specs.push({ label: 'Brand', value: product.brand });
  if (product.modelNumber) specs.push({ label: 'Model', value: product.modelNumber });
  if (product.type) specs.push({ label: 'Type', value: product.type });
  if (product.printSpeed) specs.push({ label: 'Print Speed', value: product.printSpeed });
  if (product.duplexPrinting !== undefined) specs.push({ label: 'Duplex Printing', value: product.duplexPrinting ? 'Yes' : 'No' });
  if (product.adf !== undefined) specs.push({ label: 'ADF', value: product.adf ? 'Yes' : 'No' });
  if (product.colorSupport !== undefined) specs.push({ label: 'Color', value: product.colorSupport ? 'Yes (Color)' : 'No (Mono)' });
  if (product.connectivity && product.connectivity.length > 0) specs.push({ label: 'Connectivity', value: product.connectivity.join(', ') });
  if (product.paperSizeSupported && product.paperSizeSupported.length > 0) specs.push({ label: 'Paper Sizes', value: product.paperSizeSupported.join(', ') });
  
  // Additional specs
  if (product.trolley !== undefined) specs.push({ label: 'Trolley', value: product.trolley ? 'Yes' : 'No' });
  if (product.extraTray !== undefined) specs.push({ label: 'Extra Tray', value: product.extraTray ? 'Yes' : 'No' });
  if (product.monthlyDutyCycle) specs.push({ label: 'Monthly Duty Cycle', value: `${product.monthlyDutyCycle.toLocaleString()} pages` });
  if (product.warranty) specs.push({ label: 'Warranty', value: product.warranty });
  if (product.condition) specs.push({ label: 'Condition', value: product.condition });
  if (product.stock !== undefined) specs.push({ label: 'Stock', value: product.stock > 0 ? `${product.stock} available` : 'Out of Stock' });

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

      {/* Main Content - Daraz Style */}
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
              marginBottom: '12px',
              lineHeight: 1.4
            }}>
              {product.name}
            </h1>

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

            {/* Contact Button Only */}
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

        {/* Bottom Section - Specifications */}
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
                      to={`/product /${relatedProduct._id}`}
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
    </div>
  );
}