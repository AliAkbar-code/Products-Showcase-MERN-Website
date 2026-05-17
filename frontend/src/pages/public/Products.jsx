import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ArrowRight, Package, Loader2 } from 'lucide-react';
// Import banner image from assets folder
import bannerImage from '../../assets/hero.jpeg'; // Adjust path as needed

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        if (data.data) setCategories(data.data);
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        const catParam = searchParams.get('category');
        const searchParam = searchParams.get('search');
        
        if (catParam) params.category = catParam;
        if (searchParam) params.search = searchParam;

        const { data } = await api.get('/products', { params });
        setProducts(data.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (selectedCategory) params.category = selectedCategory;
    setSearchParams(params);
  };

  const handleCategoryClick = (categoryId) => {
    const newCategory = categoryId === selectedCategory ? '' : categoryId;
    setSelectedCategory(newCategory);
    const params = {};
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (newCategory) params.category = newCategory;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSearchParams({});
  };

  const hasFilters = searchParams.get('search') || searchParams.get('category');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: {
      y: 0, opacity: 1, scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  const getImgUrl = (image) => {
    if (!image) return 'https://via.placeholder.com/400x300?text=No+Image';
    return image.startsWith('http') ? image : `http://localhost:5000${image}`;
  };

  // Find the selected category name for display
  const selectedCatObj = categories.find(c => c._id === selectedCategory);

  return (
    <div style={{ background: '#ffffff', minHeight: '80vh' }}>
      {/* Hero Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background: `url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: 'clamp(3rem, 6vw, 5rem) 20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Dark overlay for text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 0
        }} />
        
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', left: '-40px',
          width: '160px', height: '160px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)'
        }} />

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgb(25,118,210)', color: 'white',
            padding: '6px 16px', borderRadius: '20px',
            marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600,
            backdropFilter: 'blur(10px)'
          }}>
            <Package size={16} />
            Our Collection
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800, color: 'white', marginBottom: '1rem'
          }}>
            {selectedCatObj ? selectedCatObj.name : 'All Products'}
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem',
            maxWidth: '600px', margin: '0 auto'
          }}>
            {selectedCatObj 
              ? `Explore our ${selectedCatObj.name.toLowerCase()} collection`
              : 'Explore our complete range of premium printers and photocopiers'
            }
          </p>
        </motion.div>
      </motion.section>

      {/* Search & Filter Bar */}
      <section style={{ 
        maxWidth: '1280px', margin: '0 auto', padding: '0 20px',
        marginTop: '-30px', position: 'relative', zIndex: 10
      }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem 2rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb'
          }}
        >
          <form onSubmit={handleSearch} style={{
            display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'end'
          }}>
            <div style={{ flex: '1 1 300px' }}>
              <label style={{
                display: 'block', marginBottom: '0.5rem',
                fontWeight: 600, color: '#374151', fontSize: '0.9rem'
              }}>Search Products</label>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: '#9ca3af'
                }} />
                <input
                  type="text"
                  placeholder="Search by name, brand, model..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 16px 12px 44px',
                    border: '2px solid #e5e7eb', borderRadius: '10px',
                    fontSize: '1rem', fontFamily: 'Outfit, sans-serif',
                    transition: 'all 0.3s ease', outline: 'none',
                    background: '#f9fafb'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div style={{ flex: '0 1 220px' }}>
              <label style={{
                display: 'block', marginBottom: '0.5rem',
                fontWeight: 600, color: '#374151', fontSize: '0.9rem'
              }}>Category</label>
              <div style={{ position: 'relative' }}>
                <Filter size={18} style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none'
                }} />
                <select
                  value={selectedCategory}
                  onChange={e => {
                    setSelectedCategory(e.target.value);
                    const params = {};
                    if (searchTerm.trim()) params.search = searchTerm.trim();
                    if (e.target.value) params.category = e.target.value;
                    setSearchParams(params);
                  }}
                  style={{
                    width: '100%', padding: '12px 16px 12px 44px',
                    border: '2px solid #e5e7eb', borderRadius: '10px',
                    fontSize: '1rem', fontFamily: 'Outfit, sans-serif',
                    transition: 'all 0.3s ease', outline: 'none',
                    background: '#f9fafb', cursor: 'pointer',
                    appearance: 'none'
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: 'linear-gradient(135deg, #1e40af, #2563eb)',
                  color: 'white', padding: '12px 28px',
                  borderRadius: '10px', border: 'none', cursor: 'pointer',
                  fontSize: '1rem', fontWeight: 600,
                  fontFamily: 'Outfit, sans-serif',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <Search size={18} />
                Search
              </motion.button>

              {hasFilters && (
                <motion.button
                  type="button"
                  onClick={clearFilters}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: 'white', color: '#ef4444',
                    padding: '12px 20px', borderRadius: '10px',
                    border: '2px solid #fecaca', cursor: 'pointer',
                    fontSize: '1rem', fontWeight: 600,
                    fontFamily: 'Outfit, sans-serif',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  <X size={16} />
                  Clear
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </section>

      {/* Category Pills */}
      {categories.length > 0 && (
        <section style={{ maxWidth: '1280px', margin: '2rem auto 0', padding: '0 20px' }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick('')}
              style={{
                padding: '8px 20px', borderRadius: '25px',
                border: `2px solid ${!selectedCategory ? '#2563eb' : '#e5e7eb'}`,
                background: !selectedCategory ? '#2563eb' : 'white',
                color: !selectedCategory ? 'white' : '#6b7280',
                cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                fontFamily: 'Outfit, sans-serif',
                transition: 'all 0.3s ease'
              }}
            >
              All
            </motion.button>
            {categories.map(cat => (
              <motion.button
                key={cat._id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(cat._id)}
                style={{
                  padding: '8px 20px', borderRadius: '25px',
                  border: `2px solid ${selectedCategory === cat._id ? '#2563eb' : '#e5e7eb'}`,
                  background: selectedCategory === cat._id ? '#2563eb' : 'white',
                  color: selectedCategory === cat._id ? 'white' : '#6b7280',
                  cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                  fontFamily: 'Outfit, sans-serif',
                  transition: 'all 0.3s ease'
                }}
              >
                {cat.name}
              </motion.button>
            ))}
          </motion.div>
        </section>
      )}

      {/* Products Grid */}
      <section style={{ maxWidth: '1280px', margin: '3rem auto', padding: '0 20px 4rem' }}>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '4rem 0' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ display: 'inline-block' }}
            >
              <Loader2 size={48} color="#2563eb" />
            </motion.div>
            <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '1.1rem' }}>
              Loading products...
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center', padding: '3rem',
              background: '#fef2f2', borderRadius: '12px',
              color: '#991b1b', border: '1px solid #fecaca'
            }}
          >
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1rem', padding: '10px 24px',
                background: '#2563eb', color: 'white',
                borderRadius: '8px', border: 'none',
                cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                fontWeight: 600
              }}
            >
              Try Again
            </button>
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              textAlign: 'center', padding: '4rem 2rem',
              background: '#f9fafb', borderRadius: '16px',
              border: '1px solid #e5e7eb'
            }}
          >
            <Package size={64} color="#d1d5db" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: '#374151', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
              No products found
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Try adjusting your search or filter criteria
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              style={{
                padding: '10px 24px', background: '#2563eb',
                color: 'white', borderRadius: '8px', border: 'none',
                cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                fontWeight: 600, fontSize: '1rem'
              }}
            >
              Clear Filters
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '2rem'
            }}>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                Showing <strong style={{ color: '#1f2937' }}>{products.length}</strong> product{products.length !== 1 ? 's' : ''}
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem'
              }}
            >
              <AnimatePresence>
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    layout
                    whileHover={{
                      y: -8, scale: 1.02,
                      transition: { duration: 0.2, type: "spring", stiffness: 300 }
                    }}
                    onHoverStart={() => setHoveredProduct(index)}
                    onHoverEnd={() => setHoveredProduct(null)}
                    style={{ width: '100%' }}
                  >
                    <div style={{
                      background: '#ffffff', borderRadius: '16px',
                      overflow: 'hidden',
                      border: `1px solid ${hoveredProduct === index ? '#2563eb' : '#e5e7eb'}`,
                      transition: 'all 0.3s ease',
                      boxShadow: hoveredProduct === index
                        ? '0 20px 40px -12px rgba(37,99,235,0.15)'
                        : '0 1px 3px rgba(0,0,0,0.04)',
                      height: '100%', display: 'flex', flexDirection: 'column'
                    }}>
                      <Link
                        to={`/product/${product._id}`}
                        style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}
                      >
                        {/* Image */}
                        <div style={{
                          position: 'relative', height: '220px',
                          overflow: 'hidden', backgroundColor: '#f9fafb'
                        }}>
                          <motion.img
                            src={getImgUrl(product.image)}
                            alt={product.name}
                            style={{
                              width: '100%', height: '100%', objectFit: 'cover'
                            }}
                            animate={{ scale: hoveredProduct === index ? 1.08 : 1 }}
                            transition={{ duration: 0.4 }}
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                          />
                          <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.03) 100%)'
                          }} />
                          {product.featured && (
                            <div style={{
                              position: 'absolute', top: '12px', left: '12px',
                              background: '#2563eb', color: 'white',
                              padding: '4px 12px', borderRadius: '20px',
                              fontSize: '0.75rem', fontWeight: 700,
                              letterSpacing: '0.5px'
                            }}>
                              ★ FEATURED
                            </div>
                          )}
                          {product.category?.name && (
                            <div style={{
                              position: 'absolute', top: '12px', right: '12px',
                              background: 'rgba(255,255,255,0.95)', color: '#2563eb',
                              padding: '4px 12px', borderRadius: '20px',
                              fontSize: '0.75rem', fontWeight: 700,
                              backdropFilter: 'blur(8px)'
                            }}>
                              {product.category.name}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <h3 style={{
                            fontSize: '1.15rem', fontWeight: 700,
                            color: '#1f2937', marginBottom: '0.5rem',
                            lineHeight: 1.3
                          }}>
                            {product.name}
                          </h3>
                          <p style={{
                            color: '#6b7280', fontSize: '0.9rem',
                            marginBottom: '1rem', flex: 1,
                            display: '-webkit-box', WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            lineHeight: 1.5
                          }}>
                            {product.description}
                          </p>

                          <div style={{
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between',
                            borderTop: '1px solid #f3f4f6', paddingTop: '1rem'
                          }}>
                            <span style={{
                              fontSize: '1.2rem', fontWeight: 700, color: '#2563eb'
                            }}>
                              {product.price > 0 ? `Rs ${product.price.toFixed(2)}` : 'Call for Price'}
                            </span>
                            <motion.div
                              animate={{ x: hoveredProduct === index ? 5 : 0 }}
                              style={{
                                color: '#2563eb', display: 'inline-flex',
                                alignItems: 'center', gap: '4px',
                                fontSize: '0.85rem', fontWeight: 600
                              }}
                            >
                              View Details
                              <ArrowRight size={14} />
                            </motion.div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </section>
    </div>
  );
}