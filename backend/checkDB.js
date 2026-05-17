require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce')
  .then(async () => {
    console.log('Connected to DB');
    
    const admin = await Admin.findOne({ username: 'admin' }).select('+password');
    if (!admin) {
      console.log('Admin not found in DB!');
      process.exit(1);
    }
    
    console.log('Admin found:', admin.username);
    console.log('Hashed pass in DB:', admin.password);
    
    const isMatch = await admin.matchPassword('password123');
    console.log('Does password123 match?:', isMatch);
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
