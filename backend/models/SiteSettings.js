const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    default: 'Nexus Store',
    trim: true,
    maxlength: [100, 'Store name cannot exceed 100 characters']
  },
  heroTitle: {
    type: String,
    default: 'Discover Premium Printers & Photocopiers',
    trim: true
  },
  heroSubtitle: {
    type: String,
    default: 'Explore our curated showcase of elite printers and photocopiers designed to elevate your business.',
    trim: true
  },
  heroButtonText: {
    type: String,
    default: 'Shop the Catalog',
    trim: true
  },
  aboutUs: {
    type: String,
    default: '',
    trim: true
  },
  contactEmail: {
    type: String,
    default: '',
    trim: true
  },
  contactPhone: {
    type: String,
    default: '',
    trim: true
  },
  address: {
    type: String,
    default: '',
    trim: true
  },
  socialLinks: {
    facebook: { type: String, default: '', trim: true },
    instagram: { type: String, default: '', trim: true },
    twitter: { type: String, default: '', trim: true },
    whatsapp: { type: String, default: '', trim: true }
  },
  footerText: {
    type: String,
    default: '© 2026 Nexus Store. All rights reserved.',
    trim: true
  },
  announcement: {
    enabled: { type: Boolean, default: false },
    text: { type: String, default: '', trim: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
