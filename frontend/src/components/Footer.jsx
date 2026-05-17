import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data.data);
      } catch (err) {
        // Silently fail — footer just won't show dynamic content
      }
    };
    fetchSettings();
  }, []);

  if (!settings) return null;

  const hasSocial = settings.socialLinks && (
    settings.socialLinks.facebook || settings.socialLinks.instagram ||
    settings.socialLinks.twitter || settings.socialLinks.whatsapp
  );

  const hasContact = settings.contactEmail || settings.contactPhone || settings.address;

  // Split store name for color styling
  const nameParts = (settings.storeName || 'Nexus Store').split(' ');
  const firstName = nameParts[0] || 'Nexus';
  const restName = nameParts.slice(1).join(' ') || 'Store';

  return (
    <footer style={{
      background: '#f8fafc',
      borderTop: '1px solid #e5e7eb',
      padding: '4rem 0 2rem'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          
          {/* Store Info */}
          <div>
            <h3 style={{
              fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem',
              display: 'flex', alignItems: 'center', gap: '4px'
            }}>
              <span style={{ color: '#2563eb' }}>{firstName}</span>
              <span style={{ color: '#1f2937' }}>{restName}</span>
            </h3>
            {settings.aboutUs && (
              <p style={{
                color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.7,
                display: '-webkit-box', WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical', overflow: 'hidden'
              }}>
                {settings.aboutUs}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              color: '#1f2937', marginBottom: '1.25rem',
              fontSize: '1.05rem', fontWeight: 700
            }}>Quick Links</h4>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '0.75rem'
            }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Products' },
                { to: '/services', label: 'Services' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact Us' }
              ].map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  style={{
                    color: '#6b7280', textDecoration: 'none',
                    fontSize: '0.9rem', transition: 'all 0.2s ease',
                    display: 'inline-flex', alignItems: 'center', gap: '6px'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#2563eb';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#6b7280';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  → {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          {hasContact && (
            <div>
              <h4 style={{
                color: '#1f2937', marginBottom: '1.25rem',
                fontSize: '1.05rem', fontWeight: 700
              }}>Contact Us</h4>
              <div style={{
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
                color: '#6b7280', fontSize: '0.9rem'
              }}>
                {settings.contactEmail && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1rem' }}>📧</span>
                    <a href={`mailto:${settings.contactEmail}`}
                      style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                )}
                {settings.contactPhone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1rem' }}>📞</span>
                    <a href={`tel:${settings.contactPhone}`}
                      style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
                    >
                      {settings.contactPhone}
                    </a>
                  </div>
                )}
                {settings.address && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ fontSize: '1rem' }}>📍</span>
                    <span>{settings.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Social Links */}
          {hasSocial && (
            <div>
              <h4 style={{
                color: '#1f2937', marginBottom: '1.25rem',
                fontSize: '1.05rem', fontWeight: 700
              }}>Follow Us</h4>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {settings.socialLinks.facebook && (
                  <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: '#eff6ff', color: '#2563eb',
                      transition: 'all 0.3s ease', fontSize: '1.1rem',
                      fontWeight: 700, textDecoration: 'none',
                      border: '1px solid #dbeafe'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#2563eb';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 6px 15px rgba(37,99,235,0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#eff6ff';
                      e.currentTarget.style.color = '#2563eb';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >f</a>
                )}
                {settings.socialLinks.instagram && (
                  <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: '#fdf2f8', color: '#db2777',
                      transition: 'all 0.3s ease', fontSize: '1.1rem',
                      textDecoration: 'none', border: '1px solid #fce7f3'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#db2777';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 6px 15px rgba(219,39,119,0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#fdf2f8';
                      e.currentTarget.style.color = '#db2777';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >📷</a>
                )}
                {settings.socialLinks.twitter && (
                  <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: '#f0f9ff', color: '#0284c7',
                      transition: 'all 0.3s ease', fontSize: '1.1rem',
                      textDecoration: 'none', border: '1px solid #e0f2fe'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#0284c7';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 6px 15px rgba(2,132,199,0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#f0f9ff';
                      e.currentTarget.style.color = '#0284c7';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >𝕏</a>
                )}
                {settings.socialLinks.whatsapp && (
                  <a href={`https://wa.me/${settings.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: '#f0fdf4', color: '#22c55e',
                      transition: 'all 0.3s ease', fontSize: '1.1rem',
                      textDecoration: 'none', border: '1px solid #bbf7d0'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#22c55e';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 6px 15px rgba(34,197,94,0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#f0fdf4';
                      e.currentTarget.style.color = '#22c55e';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >💬</a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: '1.5rem',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '0.85rem'
        }}>
          {settings.footerText || `© ${new Date().getFullYear()} ${settings.storeName || 'Nexus Store'}. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}
