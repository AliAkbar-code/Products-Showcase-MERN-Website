const express = require('express');
const {
  createMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage
} = require('../controllers/messageController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(createMessage)
  .get(protect, getMessages);

router
  .route('/:id')
  .put(protect, updateMessageStatus)
  .delete(protect, deleteMessage);

module.exports = router;
