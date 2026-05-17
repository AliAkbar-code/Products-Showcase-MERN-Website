const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
      trim: true,
      maxlength: [100, 'Subject can not be more than 100 characters']
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
      maxlength: [2000, 'Message can not be more than 2000 characters']
    },
    status: {
      type: String,
      enum: ['unread', 'read'],
      default: 'unread'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Message', MessageSchema);
