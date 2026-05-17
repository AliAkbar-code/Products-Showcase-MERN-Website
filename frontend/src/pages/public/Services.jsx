import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wrench, Printer, Settings, Truck, Shield, Headphones, 
  RefreshCw, FileText, ArrowRight, CheckCircle, Phone 
} from 'lucide-react';
import api from '../../utils/api';
// Import banner image from assets folder
import bannerImage from '../../assets/hero.jpeg'; // Adjust path as needed

export default function Services() {
  const [settings, setSettings] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data.data) setSettings(data.data);
      } catch (err) {}
    };
    fetchSettings();
  }, []);

  const storeName = settings?.storeName || 'Nexus Store';

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  };

  const services = [
    {
      icon: Printer,
      title: 'Printer Sales',
      description: 'Wide range of laser, inkjet, and multifunction printers from top brands like HP, Canon, Epson, and Brother.',
      features: ['New & Refurbished Options', 'Bulk Discount Available', 'Brand Warranty Included']
    },
    {
      icon: Wrench,
      title: 'Repair & Maintenance',
      description: 'Expert repair services for all brands and models. Our certified technicians ensure quick turnaround times.',
      features: ['On-site & Off-site Repair', 'Genuine Spare Parts', '90-Day Repair Warranty']
    },
    {
      icon: RefreshCw,
      title: 'Printer Rental',
      description: 'Flexible rental plans for short-term and long-term needs. Perfect for events, projects, and growing businesses.',
      features: ['Daily, Weekly & Monthly Plans', 'Free Setup & Installation', 'Replacement Guarantee']
    },
    {
      icon: Settings,
      title: 'AMC Services',
      description: 'Annual Maintenance Contracts to keep your devices running at peak performance year-round.',
      features: ['Preventive Maintenance', 'Priority Support', 'Consumable Discounts']
    },
    {
      icon: Truck,
      title: 'Delivery & Installation',
      description: 'Free delivery and professional installation services across the city. We set it up so you can start printing right away.',
      features: ['Same-Day Delivery', 'Professional Setup', 'Network Configuration']
    },
    {
      icon: Headphones,
      title: 'Technical Support',
      description: 'Dedicated support team available to assist with troubleshooting, driver installation, and connectivity issues.',
      features: ['Remote Assistance', 'Phone & Chat Support', 'Knowledge Base Access']
    },
    {
      icon: FileText,
      title: 'Toner & Supplies',
      description: 'Genuine and compatible toner cartridges, ink, and paper supplies for all major printer brands.',
      features: ['Original & Compatible Options', 'Auto-Refill Programs', 'Bulk Order Discounts']
    },
    {
      icon: Shield,
      title: 'Extended Warranty',
      description: 'Extend your peace of mind with our comprehensive warranty plans covering parts, labor, and accidental damage.',
      features: ['Up to 5 Year Coverage', 'Zero Deductible Claims', 'Transferable Plans']
    }
  ];

  const process = [
    { step: '01', title: 'Consultation', description: 'We understand your printing needs and workflow requirements.' },
    { step: '02', title: 'Recommendation', description: 'Our experts suggest the best devices and solutions for your budget.' },
    { step: '03', title: 'Delivery & Setup', description: 'We deliver, install, and configure your equipment professionally.' },
    { step: '04', title: 'Ongoing Support', description: 'We provide continuous support, maintenance, and supply management.' }
  ];

  return (
    <div style={{ background: '#ffffff', overflow: 'hidden' }}>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background: `url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: 'clamp(4rem, 8vw, 7rem) 20px',
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
        
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '10%',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)'
        }} />

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgb(25,118,210)', color: 'white',
            padding: '6px 16px', borderRadius: '20px',
            marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600,
            backdropFilter: 'blur(10px)'
          }}>
            <Wrench size={16} />
            Our Services
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800, color: 'white', marginBottom: '1.5rem',
            lineHeight: 1.2
          }}>
            Comprehensive Printing <br />
            <span >Solutions & Services</span>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem',
            lineHeight: 1.7, maxWidth: '650px', margin: '0 auto'
          }}>
            From sales to support, we offer end-to-end services to keep your business running smoothly with premium printing technology.
          </p>
        </motion.div>
      </motion.section>

      {/* Services Grid */}
      <section style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '5rem 20px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#eff6ff', color: '#2563eb',
            padding: '6px 16px', borderRadius: '20px',
            marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600
          }}>
            <Settings size={16} />
            What We Offer
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700, color: '#2563eb', marginBottom: '1rem'
          }}>
            Our Service Portfolio
          </h2>
          <p style={{
            color: '#6b7280', maxWidth: '600px', margin: '0 auto',
            fontSize: '1.1rem', lineHeight: 1.6
          }}>
            Everything you need to keep your printing infrastructure running at its best
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.01 }}
                onHoverStart={() => setHoveredService(index)}
                onHoverEnd={() => setHoveredService(null)}
                style={{
                  background: 'white', borderRadius: '16px',
                  padding: '2rem',
                  border: `1px solid ${hoveredService === index ? '#2563eb' : '#e5e7eb'}`,
                  boxShadow: hoveredService === index
                    ? '0 20px 40px -12px rgba(37,99,235,0.12)'
                    : '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s ease',
                  display: 'flex', flexDirection: 'column'
                }}
              >
                <motion.div
                  animate={{ rotate: hoveredService === index ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    width: '56px', height: '56px', borderRadius: '14px',
                    background: hoveredService === index ? '#2563eb' : '#eff6ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.5rem',
                    color: hoveredService === index ? 'white' : '#2563eb',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Icon size={26} />
                </motion.div>

                <h3 style={{
                  fontSize: '1.25rem', fontWeight: 700,
                  color: '#1f2937', marginBottom: '0.75rem'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  color: '#6b7280', lineHeight: 1.6, fontSize: '0.95rem',
                  marginBottom: '1.5rem', flex: 1
                }}>
                  {service.description}
                </p>

                <div style={{
                  borderTop: '1px solid #f3f4f6', paddingTop: '1rem'
                }}>
                  {service.features.map((feature, fi) => (
                    <div key={fi} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      marginBottom: '0.5rem', color: '#4b5563', fontSize: '0.9rem'
                    }}>
                      <CheckCircle size={14} color="#2563eb" style={{ flexShrink: 0 }} />
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* How It Works */}
      <section style={{ background: '#f8fafc', padding: '5rem 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700, color: '#2563eb', marginBottom: '1rem'
            }}>
              How It Works
            </h2>
            <p style={{
              color: '#6b7280', maxWidth: '600px', margin: '0 auto',
              fontSize: '1.1rem', lineHeight: 1.6
            }}>
              Our simple 4-step process to get you up and running
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem'
            }}
          >
            {process.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                style={{
                  background: 'white', borderRadius: '16px',
                  padding: '2.5rem 2rem', textAlign: 'center',
                  border: '1px solid #e5e7eb',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  fontSize: '3rem', fontWeight: 900,
                  color: '#eff6ff', position: 'absolute',
                  top: '10px', right: '20px',
                  lineHeight: 1
                }}>
                  {item.step}
                </div>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem', color: 'white',
                  fontSize: '1.2rem', fontWeight: 800,
                  boxShadow: '0 6px 15px rgba(37,99,235,0.3)'
                }}>
                  {item.step}
                </div>
                <h3 style={{
                  fontSize: '1.2rem', fontWeight: 700, color: '#1f2937',
                  marginBottom: '0.75rem'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: '#6b7280', lineHeight: 1.6, fontSize: '0.95rem'
                }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
        padding: '5rem 20px', textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '700px', margin: '0 auto' }}
        >
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 700, color: 'white', marginBottom: '1rem'
          }}>
            Need a Custom Solution?
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem',
            marginBottom: '2.5rem', lineHeight: 1.6
          }}>
            Contact our team for personalized recommendations tailored to your business needs.
          </p>
          <div style={{
            display: 'flex', gap: '1rem',
            justifyContent: 'center', flexWrap: 'wrap'
          }}>
            <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'white', color: '#2563eb',
                  padding: '14px 32px', borderRadius: '10px',
                  textDecoration: 'none', fontSize: '1.05rem',
                  fontWeight: 700, boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <Phone size={18} />
                Contact Us
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/products"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'transparent', color: 'white',
                  padding: '14px 32px', borderRadius: '10px',
                  textDecoration: 'none', fontSize: '1.05rem',
                  fontWeight: 700, border: '2px solid rgba(255,255,255,0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                Browse Products
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}