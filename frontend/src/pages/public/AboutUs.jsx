import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Eye, Award, Shield, Zap, Heart, Star, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
// Import the banner image from assets folder
import bannerImage from '../../assets/hero.jpeg'; // Adjust the path and filename as needed

export default function AboutUs() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data.data) setSettings(data.data);
      } catch (err) {
        // Silently fail
      }
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
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const values = [
    {
      icon: Shield,
      title: 'Trust & Reliability',
      description: 'We stand behind every product we showcase, ensuring quality and durability in every device.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We stay ahead of the curve by offering the latest printing technologies on the market.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We provide personalized consultations for every client.'
    },
    {
      icon: Star,
      title: 'Excellence',
      description: 'We partner with only the most trusted brands to deliver industry-leading products.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Products Available' },
    { number: '10K+', label: 'Happy Customers' },
    { number: '15+', label: 'Years Experience' },
    { number: '24/7', label: 'Customer Support' }
  ];

  const team = [
    { name: 'Umair', role: 'Founder & CEO', initial: 'MA' },
    { name: 'Sarah Khan', role: 'Technical Director', initial: 'SK' },
    { name: 'Ahmed Raza', role: 'Sales Manager', initial: 'AR' },
    { name: 'Fatima Noor', role: 'Customer Relations', initial: 'FN' }
  ];

  return (
    <div style={{ background: '#ffffff', overflow: 'hidden' }}>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          backgroundImage: `url(${bannerImage})`,
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
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '10%',
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
            background: 'rgb(25, 118, 210)', color: 'white',
            padding: '6px 16px', borderRadius: '20px',
            marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600,
            backdropFilter: 'blur(10px)'
          }}>
            <Users size={16} />
            About Us
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800, color: 'white', marginBottom: '1.5rem',
            lineHeight: 1.2
          }}>
            Your Trusted Partner in <br />
            <span >Printing Solutions</span>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.9)', fontSize: '1.15rem',
            lineHeight: 1.7, maxWidth: '650px', margin: '0 auto'
          }}>
            {settings?.aboutUs || `At ${storeName}, we are dedicated to providing the highest quality printers and photocopiers for businesses and individuals. With years of industry experience, we bring you the best technology solutions.`}
          </p>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section style={{
        maxWidth: '1280px', margin: '0 auto', padding: '0 20px',
        marginTop: '-40px', position: 'relative', zIndex: 10
      }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              whileHover={{ y: -5, scale: 1.02 }}
              style={{
                background: 'white', borderRadius: '16px',
                padding: '2rem 1.5rem', textAlign: 'center',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                fontWeight: 800, color: '#2563eb',
                marginBottom: '0.25rem'
              }}>
                {stat.number}
              </div>
              <div style={{ color: '#6b7280', fontWeight: 500, fontSize: '0.95rem' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section style={{
        maxWidth: '1280px', margin: '5rem auto', padding: '0 20px'
      }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}
        >
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -5 }}
            style={{
              background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
              borderRadius: '20px', padding: '3rem',
              border: '1px solid #bfdbfe',
              transition: 'transform 0.3s ease'
            }}
          >
            <div style={{
              width: '60px', height: '60px', borderRadius: '16px',
              background: '#2563eb', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <Target size={28} color="white" />
            </div>
            <h3 style={{
              fontSize: '1.5rem', fontWeight: 700, color: '#1e40af',
              marginBottom: '1rem'
            }}>
              Our Mission
            </h3>
            <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '1rem' }}>
              To empower businesses with cutting-edge printing and copying solutions that enhance productivity, 
              reduce costs, and deliver exceptional print quality. We strive to be the go-to destination for 
              all printing needs.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -5 }}
            style={{
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              borderRadius: '20px', padding: '3rem',
              border: '1px solid #bae6fd',
              transition: 'transform 0.3s ease'
            }}
          >
            <div style={{
              width: '60px', height: '60px', borderRadius: '16px',
              background: '#0284c7', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <Eye size={28} color="white" />
            </div>
            <h3 style={{
              fontSize: '1.5rem', fontWeight: 700, color: '#0c4a6e',
              marginBottom: '1rem'
            }}>
              Our Vision
            </h3>
            <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '1rem' }}>
              To become the leading provider of printing solutions in the region, recognized for our 
              unmatched product quality, innovative technology partnerships, and commitment to 
              sustainable business practices.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Core Values */}
      <section style={{
        background: '#f8fafc', padding: '5rem 20px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
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
              <Award size={16} />
              What We Stand For
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700, color: '#2563eb', marginBottom: '1rem'
            }}>
              Our Core Values
            </h2>
            <p style={{
              color: '#6b7280', maxWidth: '600px', margin: '0 auto',
              fontSize: '1.1rem', lineHeight: 1.6
            }}>
              The principles that guide everything we do
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  whileHover={{ y: -8, scale: 1.02 }}
                  style={{
                    background: 'white', borderRadius: '16px',
                    padding: '2rem', textAlign: 'center',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 0.3s ease',
                    cursor: 'default'
                  }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: '64px', height: '64px', borderRadius: '16px',
                      background: '#eff6ff', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 1.5rem', color: '#2563eb'
                    }}
                  >
                    <Icon size={28} />
                  </motion.div>
                  <h3 style={{
                    fontSize: '1.2rem', fontWeight: 700,
                    color: '#1f2937', marginBottom: '0.75rem'
                  }}>
                    {value.title}
                  </h3>
                  <p style={{
                    color: '#6b7280', lineHeight: 1.6, fontSize: '0.95rem'
                  }}>
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
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
            <Users size={16} />
            Our Team
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700, color: '#2563eb', marginBottom: '1rem'
          }}>
            Meet the Experts
          </h2>
          <p style={{
            color: '#6b7280', maxWidth: '600px', margin: '0 auto',
            fontSize: '1.1rem', lineHeight: 1.6
          }}>
            Our dedicated professionals are here to help you find the perfect solution
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem'
          }}
        >
          {team.map((member, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              style={{
                background: 'white', borderRadius: '16px',
                padding: '2.5rem 1.5rem', textAlign: 'center',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.3s ease'
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem', color: 'white',
                  fontSize: '1.5rem', fontWeight: 700,
                  boxShadow: '0 8px 20px rgba(37,99,235,0.3)'
                }}
              >
                {member.initial}
              </motion.div>
              <h3 style={{
                fontSize: '1.15rem', fontWeight: 700,
                color: '#1f2937', marginBottom: '0.25rem'
              }}>
                {member.name}
              </h3>
              <p style={{ color: '#2563eb', fontWeight: 600, fontSize: '0.9rem' }}>
                {member.role}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
        padding: '5rem 20px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700, color: 'white', marginBottom: '1rem'
            }}>
              Why Choose {storeName}?
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto',
              fontSize: '1.1rem'
            }}>
              Here's what sets us apart from the competition
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {[
              'Authorized dealer for top brands',
              'Expert technical consultation',
              'Competitive pricing guaranteed',
              'Fast delivery & installation',
              'Comprehensive warranty coverage',
              'After-sale support & maintenance'
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px', padding: '1.25rem 1.5rem',
                  border: '1px solid rgba(255,255,255,0.15)'
                }}
              >
                <CheckCircle size={22} color="#93c5fd" style={{ flexShrink: 0 }} />
                <span style={{ color: 'white', fontWeight: 500, fontSize: '1rem' }}>
                  {item}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}