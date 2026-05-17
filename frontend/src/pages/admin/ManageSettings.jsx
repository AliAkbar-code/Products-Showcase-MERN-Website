import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Alert from '../../components/Alert';

export default function ManageSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Store Identity
  const [storeName, setStoreName] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroButtonText, setHeroButtonText] = useState('');

  // Contact
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');

  // About
  const [aboutUs, setAboutUs] = useState('');

  // Social Links
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Footer
  const [footerText, setFooterText] = useState('');

  // Announcement
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        const s = data.data;
        setStoreName(s.storeName || '');
        setHeroTitle(s.heroTitle || '');
        setHeroSubtitle(s.heroSubtitle || '');
        setHeroButtonText(s.heroButtonText || '');
        setContactEmail(s.contactEmail || '');
        setContactPhone(s.contactPhone || '');
        setAddress(s.address || '');
        setAboutUs(s.aboutUs || '');
        setFacebook(s.socialLinks?.facebook || '');
        setInstagram(s.socialLinks?.instagram || '');
        setTwitter(s.socialLinks?.twitter || '');
        setWhatsapp(s.socialLinks?.whatsapp || '');
        setFooterText(s.footerText || '');
        setAnnouncementEnabled(s.announcement?.enabled || false);
        setAnnouncementText(s.announcement?.text || '');
      } catch (err) {
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await api.put('/settings', {
        storeName,
        heroTitle,
        heroSubtitle,
        heroButtonText,
        contactEmail,
        contactPhone,
        address,
        aboutUs,
        socialLinks: { facebook, instagram, twitter, whatsapp },
        footerText,
        announcement: { enabled: announcementEnabled, text: announcementText }
      });
      setSuccess('Settings saved successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-fade-in"><p>Loading settings...</p></div>;
  }

  const sectionStyle = {
    // background: 'rgba(0,0,0,0.2)',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '2rem'
  };

  const gridStyle = {
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem' }}>Site Settings</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Control all public-facing content on your store from here.
      </p>

      <Alert type="error" message={error} onClose={() => setError(null)} />
      <Alert type="success" message={success} onClose={() => setSuccess(null)} />

      <form onSubmit={handleSubmit}>
        {/* Store Identity */}
        <div style={sectionStyle}>
          <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🏪 Store Identity
          </h4>
          <div style={gridStyle}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Store Name</label>
              <input type="text" className="form-input" value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="e.g. Nexus Store" maxLength={100} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Hero Button Text</label>
              <input type="text" className="form-input" value={heroButtonText} onChange={e => setHeroButtonText(e.target.value)} placeholder="e.g. Shop the Catalog" maxLength={50} />
            </div>
          </div>
          <div className="form-group" style={{ margin: '1.5rem 0 0 0' }}>
            <label className="form-label">Hero Title</label>
            <input type="text" className="form-input" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} placeholder="Main heading on homepage" maxLength={200} />
          </div>
          <div className="form-group" style={{ margin: '1.5rem 0 0 0' }}>
            <label className="form-label">Hero Subtitle</label>
            <textarea className="form-input" rows="2" value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} placeholder="Subheading text below hero title" maxLength={500}></textarea>
          </div>
        </div>

        {/* Contact Information */}
        <div style={sectionStyle}>
          <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📞 Contact Information
          </h4>
          <div style={gridStyle}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="e.g. info@store.com" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Phone</label>
              <input type="text" className="form-input" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="e.g. +1 234 567 890" />
            </div>
          </div>
          <div className="form-group" style={{ margin: '1.5rem 0 0 0' }}>
            <label className="form-label">Address</label>
            <input type="text" className="form-input" value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. 123 Print Street, City" />
          </div>
        </div>

        {/* About Us */}
        <div style={sectionStyle}>
          <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ℹ️ About Us
          </h4>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">About Text</label>
            <textarea className="form-input" rows="5" value={aboutUs} onChange={e => setAboutUs(e.target.value)} placeholder="Tell visitors about your business..."></textarea>
          </div>
        </div>

        {/* Social Media */}
        <div style={sectionStyle}>
          <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🌐 Social Media Links
          </h4>
          <div style={gridStyle}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Facebook URL</label>
              <input type="text" className="form-input" value={facebook} onChange={e => setFacebook(e.target.value)} placeholder="https://facebook.com/..." />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Instagram URL</label>
              <input type="text" className="form-input" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="https://instagram.com/..." />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Twitter URL</label>
              <input type="text" className="form-input" value={twitter} onChange={e => setTwitter(e.target.value)} placeholder="https://twitter.com/..." />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">WhatsApp Number</label>
              <input type="text" className="form-input" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="e.g. 1234567890" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={sectionStyle}>
          <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📄 Footer
          </h4>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Footer Text</label>
            <input type="text" className="form-input" value={footerText} onChange={e => setFooterText(e.target.value)} placeholder="© 2026 Your Store. All rights reserved." />
          </div>
        </div>

        {/* Announcement Bar */}
        <div style={sectionStyle}>
          <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📢 Announcement Bar
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              id="announcementToggle"
              checked={announcementEnabled}
              onChange={e => setAnnouncementEnabled(e.target.checked)}
              style={{ width: '20px', height: '20px' }}
            />
            <label htmlFor="announcementToggle" style={{ cursor: 'pointer', userSelect: 'none' }}>
              Enable announcement bar on public pages
            </label>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Announcement Text</label>
            <input
              type="text"
              className="form-input"
              value={announcementText}
              onChange={e => setAnnouncementText(e.target.value)}
              placeholder="e.g. Free shipping on orders over $500!"
              disabled={!announcementEnabled}
              style={{ opacity: announcementEnabled ? 1 : 0.5 }}
            />
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
