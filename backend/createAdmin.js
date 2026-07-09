require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce')
  .then(async () => {
    console.log('Connected to DB');
    
    // Clear out any existing admin with the username 'admin'
    await Admin.deleteOne({ username: 'admin' });
    console.log('Removed old admin user (if any).');

    await Admin.create({ username: 'admin', password: 'admin123' });
    console.log('Successfully created default Admin!');
    console.log('Username: admin');
    console.log('Password: admin@123');
    process.exit(0);
  })                                                     
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
