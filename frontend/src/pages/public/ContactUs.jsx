import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Clock, Send, MessageCircle, 
  CheckCircle, ArrowRight, Headphones 
} from 'lucide-react';
import api from '../../utils/api';
// Import banner image from assets folder
import bannerImage from '../../assets/hero.jpeg'; // Adjust path as needed

export default function ContactUs() {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

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

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/messages', formData);
      setSubmitStatus('success');
      setTimeout(() => {
        setSubmitStatus(null);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }, 3000);
    } catch (err) {
      console.error('Error submitting message:', err);
    }
  };

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

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      detail: settings?.contactPhone || '+92 300 1234567',
      action: `tel:${settings?.contactPhone || '+923001234567'}`,
      actionText: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email',
      detail: settings?.contactEmail || 'info@nexusstore.com',
      action: `mailto:${settings?.contactEmail || 'info@nexusstore.com'}`,
      actionText: 'Send Email'
    },
    {
      icon: MapPin,
      title: 'Address',
      detail: settings?.address || 'Main Market, Lahore, Pakistan',
      action: null,
      actionText: 'Get Directions'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      detail: 'Mon - Sat: 9:00 AM - 8:00 PM',
      action: null,
      actionText: null
    }
  ];

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '1rem',
    fontFamily: 'Outfit, sans-serif',
    transition: 'all 0.3s ease',
    outline: 'none',
    background: '#f9fafb',
    color: '#1f2937'
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#2563eb';
    e.target.style.background = 'white';
    e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#e5e7eb';
    e.target.style.background = '#f9fafb';
    e.target.style.boxShadow = 'none';
  };

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
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '15%',
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
            <Headphones size={16} />
            Get In Touch
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800, color: 'white', marginBottom: '1.5rem',
            lineHeight: 1.2
          }}>
            We'd Love to <br />
            <span >Hear From You</span>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem',
            lineHeight: 1.7, maxWidth: '650px', margin: '0 auto'
          }}>
            Have questions about our products or services? Need a custom quote? Our team is ready to help you find the perfect solution.
          </p>
        </motion.div>
      </motion.section>

      {/* Contact Cards */}
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ y: -5, scale: 1.02 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                style={{
                  background: 'white', borderRadius: '16px',
                  padding: '2rem 1.5rem', textAlign: 'center',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                  border: `1px solid ${hoveredCard === index ? '#2563eb' : '#e5e7eb'}`,
                  transition: 'all 0.3s ease'
                }}
              >
                <motion.div
                  animate={{ rotate: hoveredCard === index ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    width: '56px', height: '56px', borderRadius: '14px',
                    background: hoveredCard === index ? '#2563eb' : '#eff6ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem',
                    color: hoveredCard === index ? 'white' : '#2563eb',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Icon size={24} />
                </motion.div>
                <h3 style={{
                  fontSize: '1.1rem', fontWeight: 700, color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  {info.title}
                </h3>
                <p style={{
                  color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.5,
                  marginBottom: info.action ? '1rem' : '0'
                }}>
                  {info.detail}
                </p>
                {info.action && (
                  <a
                    href={info.action}
                    style={{
                      color: '#2563eb', fontWeight: 600, fontSize: '0.9rem',
                      textDecoration: 'none', display: 'inline-flex',
                      alignItems: 'center', gap: '4px'
                    }}
                  >
                    {info.actionText}
                    <ArrowRight size={14} />
                  </a>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Contact Form + Map */}
      <section style={{
        maxWidth: '1280px', margin: '5rem auto', padding: '0 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '3rem',
          alignItems: 'start'
        }}>
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#eff6ff', color: '#2563eb',
              padding: '6px 16px', borderRadius: '20px',
              marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600
            }}>
              <MessageCircle size={16} />
              Send a Message
            </div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: 700, color: '#2563eb', marginBottom: '0.75rem'
            }}>
              Drop Us a Line
            </h2>
            <p style={{
              color: '#6b7280', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.6
            }}>
              Fill out the form below and we'll get back to you within 24 hours.
            </p>

            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: '#f0fdf4', border: '1px solid #bbf7d0',
                  borderRadius: '12px', padding: '1rem 1.5rem',
                  marginBottom: '1.5rem', display: 'flex',
                  alignItems: 'center', gap: '10px', color: '#166534'
                }}
              >
                <CheckCircle size={20} />
                <span style={{ fontWeight: 600 }}>Message sent successfully! We'll be in touch soon.</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem', marginBottom: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block', marginBottom: '0.5rem',
                    fontWeight: 600, color: '#374151', fontSize: '0.9rem'
                  }}>Full Name *</label>
                  <input
                    type="text" name="name" required
                    value={formData.name} onChange={handleChange}
                    placeholder="Your name"
                    style={inputStyle}
                    onFocus={handleFocus} onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block', marginBottom: '0.5rem',
                    fontWeight: 600, color: '#374151', fontSize: '0.9rem'
                  }}>Email *</label>
                  <input
                    type="email" name="email" required
                    value={formData.email} onChange={handleChange}
                    placeholder="your@email.com"
                    style={inputStyle}
                    onFocus={handleFocus} onBlur={handleBlur}
                  />
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem', marginBottom: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block', marginBottom: '0.5rem',
                    fontWeight: 600, color: '#374151', fontSize: '0.9rem'
                  }}>Phone</label>
                  <input
                    type="tel" name="phone"
                    value={formData.phone} onChange={handleChange}
                    placeholder="+92 300 1234567"
                    style={inputStyle}
                    onFocus={handleFocus} onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block', marginBottom: '0.5rem',
                    fontWeight: 600, color: '#374151', fontSize: '0.9rem'
                  }}>Subject *</label>
                  <select
                    name="subject" required
                    value={formData.subject} onChange={handleChange}
                    style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
                    onFocus={handleFocus} onBlur={handleBlur}
                  >
                    <option value="">Select a topic</option>
                    <option value="sales">Product Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="rental">Rental Inquiry</option>
                    <option value="repair">Repair Service</option>
                    <option value="quote">Request a Quote</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block', marginBottom: '0.5rem',
                  fontWeight: 600, color: '#374151', fontSize: '0.9rem'
                }}>Message *</label>
                <textarea
                  name="message" required rows={5}
                  value={formData.message} onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                  onFocus={handleFocus} onBlur={handleBlur}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: 'linear-gradient(135deg, #1e40af, #2563eb)',
                  color: 'white', padding: '14px 36px',
                  borderRadius: '12px', border: 'none',
                  cursor: 'pointer', fontSize: '1.05rem',
                  fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                  boxShadow: '0 4px 15px rgba(37,99,235,0.3)',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  width: '100%', justifyContent: 'center'
                }}
              >
                <Send size={18} />
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Map Placeholder */}
            <div style={{
              background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
              borderRadius: '20px', padding: '2rem',
              border: '1px solid #bfdbfe', marginBottom: '2rem',
              minHeight: '300px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', textAlign: 'center'
            }}>
              <MapPin size={48} color="#2563eb" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#1e40af', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Visit Our Store
              </h3>
              <p style={{ color: '#4b5563', lineHeight: 1.6, maxWidth: '300px' }}>
                {settings?.address || 'Main Market, Lahore, Pakistan'}
              </p>
            </div>

            {/* Social & WhatsApp */}
            <div style={{
              background: 'white', borderRadius: '16px',
              padding: '2rem', border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{
                fontSize: '1.2rem', fontWeight: 700, color: '#1f2937',
                marginBottom: '1.5rem'
              }}>
                Connect With Us
              </h3>

              {settings?.socialLinks?.whatsapp && (
                <motion.a
                  href={`https://wa.me/${settings.socialLinks.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: '#f0fdf4', borderRadius: '12px',
                    padding: '1rem 1.5rem', textDecoration: 'none',
                    border: '1px solid #bbf7d0', marginBottom: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: '#22c55e', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '1.2rem'
                  }}>
                    💬
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#166534', fontSize: '0.95rem' }}>
                      WhatsApp
                    </div>
                    <div style={{ color: '#4ade80', fontSize: '0.85rem' }}>
                      Chat with us instantly
                    </div>
                  </div>
                  <ArrowRight size={16} color="#22c55e" style={{ marginLeft: 'auto' }} />
                </motion.a>
              )}

              <div style={{
                display: 'flex', gap: '0.75rem', flexWrap: 'wrap'
              }}>
                {settings?.socialLinks?.facebook && (
                  <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                    style={{
                      flex: 1, padding: '1rem', borderRadius: '12px',
                      background: '#eff6ff', textAlign: 'center',
                      textDecoration: 'none', border: '1px solid #dbeafe',
                      transition: 'all 0.3s ease', minWidth: '100px'
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>f</div>
                    <div style={{ color: '#2563eb', fontWeight: 600, fontSize: '0.85rem' }}>Facebook</div>
                  </a>
                )}
                {settings?.socialLinks?.instagram && (
                  <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                    style={{
                      flex: 1, padding: '1rem', borderRadius: '12px',
                      background: '#fdf2f8', textAlign: 'center',
                      textDecoration: 'none', border: '1px solid #fce7f3',
                      transition: 'all 0.3s ease', minWidth: '100px'
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📷</div>
                    <div style={{ color: '#db2777', fontWeight: 600, fontSize: '0.85rem' }}>Instagram</div>
                  </a>
                )}
                {settings?.socialLinks?.twitter && (
                  <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                    style={{
                      flex: 1, padding: '1rem', borderRadius: '12px',
                      background: '#f0f9ff', textAlign: 'center',
                      textDecoration: 'none', border: '1px solid #e0f2fe',
                      transition: 'all 0.3s ease', minWidth: '100px'
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>𝕏</div>
                    <div style={{ color: '#0284c7', fontWeight: 600, fontSize: '0.85rem' }}>Twitter</div>
                  </a>
                )}
              </div>

              {/* If no social links, show default */}
              {!settings?.socialLinks?.facebook && !settings?.socialLinks?.instagram && !settings?.socialLinks?.whatsapp && (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>
                  Follow us on social media for the latest updates and offers!
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ background: '#f8fafc', padding: '5rem 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: 700, color: '#2563eb', marginBottom: '1rem'
            }}>
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {[
              { q: 'Do you offer delivery services?', a: 'Yes, we offer free delivery and professional installation across the city for all purchases.' },
              { q: 'What brands do you carry?', a: 'We carry all major brands including HP, Canon, Epson, Brother, Xerox, Kyocera, and more.' },
              { q: 'Do you provide warranty on products?', a: 'Yes, all new products come with manufacturer warranty. We also offer extended warranty plans.' },
              { q: 'Can I rent a printer for a short period?', a: 'Absolutely! We offer flexible rental plans — daily, weekly, and monthly options available.' },
              { q: 'Do you service all printer brands?', a: 'Yes, our certified technicians can repair and maintain printers from all major brands.' }
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                style={{
                  background: 'white', borderRadius: '12px',
                  padding: '1.5rem 2rem',
                  border: '1px solid #e5e7eb'
                }}
              >
                <h4 style={{
                  color: '#1f2937', fontSize: '1.05rem', fontWeight: 700,
                  marginBottom: '0.5rem'
                }}>
                  {faq.q}
                </h4>
                <p style={{ color: '#6b7280', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}