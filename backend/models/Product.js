const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    min: [0, 'Price must be a positive number'],
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
  },
  modelNumber: {
    type: String,
    required: [true, 'Model Number is required'],
    unique: true,
    trim: true,
  },
  
  // Technical Specifications
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['Copier', 'Mfp', 'printer', 'IT equipment'],
  },
  colorSupport: {
    type: Boolean,
    required: [true, 'Color support is required'],
  },

  printSpeed: {
    type: String, // e.g., "20 ppm"
  },
  paperSizeSupported: {
    type: [String], // e.g., ["A4", "A3"]
  },
  connectivity: {
    type: [String], // e.g., ["USB", "WiFi"]
  },
  duplexPrinting: {
    type: Boolean,
  },
  adf: {
    type: Boolean,
  },
  trolley: {
    type: Boolean,
  },
  extraTray: {
    type: Boolean,
  },
  monthlyDutyCycle: {
    type: Number,
  },

  // Additional Fields
  warranty: {
    type: String,
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: ['New', 'Used', 'Refurbished'],
  },
  stock: {
    type: Number,
    min: [0, 'Stock cannot be negative'],
  },

  // System
  featured: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);


// Adf , Duplex , Trolley , Extra Tray add check box and remove funtions or scan type 
// Type Copier , Mfp , printer , IT equipment