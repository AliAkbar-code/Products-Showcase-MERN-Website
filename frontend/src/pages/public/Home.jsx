import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ProductCard from '../../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Printer, Copy, Zap, Trophy, TrendingUp, Award, Package } from 'lucide-react';
import Heroimage1 from '../../assets/webbanner1.jpg';
import Heroimage2 from '../../assets/webbanner2.jpg'
export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [settings, setSettings] = useState(null);
  const [apiCategories, setApiCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Icon mapping for categories
  const iconMap = [Printer, Copy, Zap, Trophy, TrendingUp, Award, Package];
  const defaultImages = [
    'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1581092335871-4d6b9e9d6b5c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop'
  ];

  // Use API categories if available, else fallback
  const categories = apiCategories.length > 0
    ? apiCategories.map((cat, i) => ({
        id: cat._id,
        name: cat.name,
        icon: iconMap[i % iconMap.length],
        description: cat.description || `Browse our ${cat.name} collection`,
        image: cat.image
          ? (cat.image.startsWith('http') ? cat.image : `http://localhost:5000${cat.image}`)
          : defaultImages[i % defaultImages.length],
        productCount: cat.productCount || 0
      }))
    : [];

  // Hero carousel images
  const heroSlides = [
    {
      image: Heroimage2,
      title: settings?.heroTitle || 'Discover Premium Printers & Photocopiers',
      subtitle: settings?.heroSubtitle || 'Explore our curated showcase of elite printers and photocopiers designed to elevate your business.',
      buttonText: settings?.heroButtonText || 'Shop the Catalog'
    },
    {
      image: Heroimage1,
      title: 'High-Quality Printing Solutions',
      subtitle: 'Experience crystal clear prints with our latest technology',
      buttonText: 'Explore Now'
    },
    {
      image: Heroimage1,
      title: 'Eco-Friendly Photocopiers',
      subtitle: 'Save energy while delivering exceptional performance',
      buttonText: 'Learn More'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        try {
          const prodRes = await api.get('/products/featured');
          if (prodRes.data && prodRes.data.data && prodRes.data.data.length > 0) {
            setFeatured(prodRes.data.data.slice(0, 6));
          } else {
            setFeatured([]);
          }
        } catch (prodError) {
          setFeatured([]);
        }

        try {
          const settingsRes = await api.get('/settings');
          if (settingsRes.data && settingsRes.data.data) {
            setSettings(settingsRes.data.data);
          }
        } catch (settingsError) {
          console.error('Error fetching settings:', settingsError);
        }

        // Fetch categories from API
        try {
          const catRes = await api.get('/categories');
          if (catRes.data && catRes.data.data && catRes.data.data.length > 0) {
            setApiCategories(catRes.data.data);
          }
        } catch (catError) {
          console.error('Error fetching categories:', catError);
        }
        
        setError(null);
      } catch (err) {
        setError('Unable to load products.');
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index) => {
    if (index > currentSlide) {
      setDirection(1);
    } else if (index < currentSlide) {
      setDirection(-1);
    }
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction === 1 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction === 1 ? '-100%' : '100%',
      opacity: 0
    })
  };

  const featuredContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const featuredItemVariants = {
    hidden: { 
      y: 50, 
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.6
      }
    }
  };

  const categoryContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const categoryItemVariants = {
    hidden: { 
      y: 50, 
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.6
      }
    }
  };

  return (
    <div style={{ overflowX: 'hidden', background: '#ffffff' }}>
      {/* Announcement Bar */}
      {settings?.announcement?.enabled === true && 
       settings?.announcement?.text && 
       settings.announcement.text.trim() !== '' && (
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          style={{
            background: '#eff6ff',
            color: '#2563eb',
            textAlign: 'center',
            padding: '12px 20px',
            fontSize: '0.9rem',
            fontWeight: 500,
            position: 'relative',
            zIndex: 10,
            borderBottom: '1px solid #dbeafe'
          }}
        >
          {settings.announcement.text}
        </motion.div>
      )}

      {/* Hero Carousel Section */}
      <section style={{ position: 'relative', height: '80vh', minHeight: '500px', overflow: 'hidden' }}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", ease: "easeInOut", duration: 0.6 },
              opacity: { duration: 0.4 }
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${heroSlides[currentSlide].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)'
            }} />
            
            <div style={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'white',
              padding: '0 20px',
              zIndex: 1
            }}>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{ maxWidth: '800px' }}
              >
                <h1 
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    marginBottom: '1rem',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {heroSlides[currentSlide].title}
                </h1>
                <p 
                  style={{
                    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                    marginBottom: '2rem',
                    opacity: 0.95,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  {heroSlides[currentSlide].subtitle}
                </p>
                <Link 
                  to="/products" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#2563eb',
                    color: 'white',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(37,99,235,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(37,99,235,0.3)';
                  }}
                >
                  {heroSlides[currentSlide].buttonText}
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 10,
            color: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.4)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <ChevronLeft size={30} />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 10,
            color: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.4)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <ChevronRight size={30} />
        </button>

        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 10
        }}>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              style={{
                width: currentSlide === index ? '30px' : '10px',
                height: '10px',
                borderRadius: '5px',
                border: 'none',
                background: currentSlide === index ? '#2563eb' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0
              }}
            />
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section style={{ 
        padding: '5rem 20px',
        background: '#ffffff'
      }}>
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#eff6ff',
                color: '#2563eb',
                padding: '6px 16px',
                borderRadius: '20px',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              <Sparkles size={16} />
              Premium Collection
            </motion.div>
            
            <h2 style={{ 
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              marginBottom: '1rem',
              fontWeight: 700,
              color: '#2563eb'
            }}>
              Featured Selection
            </h2>
            
            <p style={{ 
              color: '#6b7280', 
              maxWidth: '600px', 
              margin: '0 auto',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}>
              Discover our handpicked collection of premium products
            </p>
          </motion.div>
          
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '3rem' }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                border: '3px solid #e5e7eb',
                borderTop: '3px solid #2563eb',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }} />
              <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading amazing products...</p>
            </motion.div>
          ) : (
            <>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ 
                    textAlign: 'center', 
                    padding: '1rem',
                    marginBottom: '2rem',
                    background: '#fef3c7',
                    borderRadius: '8px',
                    color: '#92400e'
                  }}
                >
                  <p>{error}</p>
                </motion.div>
              )}
              
              {featured.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: 'center', padding: '3rem' }}
                >
                  <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Check back soon for new arrivals!</p>
                </motion.div>
              ) : (
                <motion.div 
                  variants={featuredContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                    gap: '2rem',
                    justifyItems: 'center',
                    alignItems: 'stretch'
                  }}
                >
                  {featured.map((product, index) => (
                    <motion.div
                      key={product._id || index}
                      variants={featuredItemVariants}
                      whileHover={{ 
                        y: -10,
                        scale: 1.02,
                        transition: { duration: 0.2, type: "spring", stiffness: 300 }
                      }}
                      onHoverStart={() => setHoveredProduct(index)}
                      onHoverEnd={() => setHoveredProduct(null)}
                      style={{
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer'
                      }}
                    >
                     <div style={{
  cursor: 'pointer',
  width: '100%',
  height: '100%',
  background: '#ffffff',
  borderRadius: '12px',
  overflow: 'hidden',
  border: `1px solid ${hoveredProduct === index ? '#2563eb' : '#e5e7eb'}`,
  transition: 'all 0.3s ease',
  boxShadow: hoveredProduct === index 
    ? '0 20px 25px -12px rgba(37,99,235,0.15)' 
    : '0 1px 3px rgba(0,0,0,0.05)'
}}>
  <Link 
    to={`/product/${product._id}`}
    style={{ textDecoration: 'none', display: 'block', height: '100%' }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Image */}
      <div style={{
        position: 'relative',
        height: '200px',
        overflow: 'hidden',
        backgroundColor: '#f9fafb'
      }}>
        <motion.img 
          src={product.image} 
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          animate={{
            scale: hoveredProduct === index ? 1.1 : 1
          }}
          transition={{ duration: 0.4 }}
        />

        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(37,99,235,0.05))'
        }} />
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem', flex: 1 }}>

        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          {product.name}
        </h3>

        <p style={{
          color: '#6b7280',
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          {product.description}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #f3f4f6',
          paddingTop: '1rem'
        }}>
          <span style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#2563eb'
          }}>
            ${product.price}
          </span>

          <motion.div
            animate={{
              x: hoveredProduct === index ? 5 : 0
            }}
            style={{
              color: '#2563eb',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            View
            <ArrowRight size={14} />
          </motion.div>
        </div>

      </div>
    </div>
  </Link>
</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {featured.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  style={{ textAlign: 'center', marginTop: '4rem' }}
                >
                  <Link 
                    to="/products"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'transparent',
                      color: '#2563eb',
                      padding: '12px 32px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      border: '2px solid #2563eb',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#2563eb';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#2563eb';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    View All Products
                    <ArrowRight size={18} />
                  </Link>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Categories Section - Same style as Featured Section */}
      {categories.length > 0 && (
        <section style={{ 
          padding: '5rem 20px',
          background: '#ffffff'
        }}>
          <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#eff6ff',
                  color: '#2563eb',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                <Trophy size={16} />
                Shop by Category
              </motion.div>
              
              <h2 style={{ 
                fontSize: 'clamp(2rem, 4vw, 3rem)', 
                marginBottom: '1rem',
                fontWeight: 700,
                color: '#2563eb'
              }}>
                Browse Categories
              </h2>
              
              <p style={{ 
                color: '#6b7280', 
                maxWidth: '600px', 
                margin: '0 auto',
                fontSize: '1.1rem',
                lineHeight: 1.6
              }}>
                Find the perfect device for your needs
              </p>
            </motion.div>

            <motion.div 
              variants={categoryContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '2rem',
                justifyItems: 'center',
                alignItems: 'stretch'
              }}
            >
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    variants={categoryItemVariants}
                    whileHover={{ 
                      y: -10,
                      scale: 1.02,
                      transition: { duration: 0.2, type: "spring", stiffness: 300 }
                    }}
                    onHoverStart={() => setHoveredCategory(index)}
                    onHoverEnd={() => setHoveredCategory(null)}
                    style={{
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%',
                      background: '#ffffff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: `1px solid ${hoveredCategory === index ? '#2563eb' : '#e5e7eb'}`,
                      transition: 'all 0.3s ease',
                      boxShadow: hoveredCategory === index 
                        ? '0 20px 25px -12px rgba(37,99,235,0.15)' 
                        : '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Link 
                      to={`/products?category=${category.id}`}
                      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        height: '100%'
                      }}>
                        {/* Category Image */}
                        <div style={{
                          position: 'relative',
                          height: '200px',
                          overflow: 'hidden',
                          backgroundColor: '#f9fafb'
                        }}>
                          <motion.img 
                            src={category.image} 
                            alt={category.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain'
                            }}
                            animate={{
                              scale: hoveredCategory === index ? 1.1 : 1
                            }}
                            transition={{ duration: 0.4 }}
                          />
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(37,99,235,0.05))'
                          }} />
                        </div>

                        {/* Category Content */}
                        <div style={{ padding: '1.5rem', flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '1rem'
                          }}>
                            <motion.div 
                              style={{
                                padding: '10px',
                                background: hoveredCategory === index ? '#2563eb' : '#eff6ff',
                                borderRadius: '12px',
                                display: 'inline-flex',
                                color: hoveredCategory === index ? 'white' : '#2563eb',
                                transition: 'all 0.3s ease'
                              }}
                              animate={{
                                rotate: hoveredCategory === index ? 360 : 0
                              }}
                              transition={{ duration: 0.4 }}
                            >
                              <IconComponent size={24} />
                            </motion.div>
                            <h3 style={{
                              fontSize: '1.25rem',
                              fontWeight: 700,
                              color: '#1f2937',
                              margin: 0
                            }}>
                              {category.name}
                            </h3>
                          </div>
                          
                          <p style={{
                            color: '#6b7280',
                            marginBottom: '1.5rem',
                            lineHeight: 1.5,
                            fontSize: '0.95rem'
                          }}>
                            {category.description}
                          </p>
                          
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 'auto',
                            borderTop: '1px solid #f3f4f6',
                            paddingTop: '1rem'
                          }}>
                            <span style={{
                              fontSize: '0.85rem',
                              color: '#2563eb',
                              fontWeight: 600
                            }}>
                              {category.productCount} Products
                            </span>
                            <motion.div
                              animate={{
                                x: hoveredCategory === index ? 5 : 0
                              }}
                              transition={{ duration: 0.2 }}
                              style={{
                                color: '#2563eb',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.85rem',
                                fontWeight: 600
                              }}
                            >
                              Shop Now
                              <ArrowRight size={14} />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{ textAlign: 'center', marginTop: '4rem' }}
            >
              <Link 
                to="/products"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  color: '#2563eb',
                  padding: '12px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: '2px solid #2563eb',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#2563eb';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#2563eb';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Explore All Categories
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .container {
          width: 100%;
          margin: 0 auto;
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }
        }
      `}</style>
    </div>
  );
}