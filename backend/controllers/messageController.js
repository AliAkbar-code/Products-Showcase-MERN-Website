const ErrorResponse = require('../utils/errorResponse');
const Message = require('../models/Message');

// @desc    Create a message
// @route   POST /api/messages
// @access  Public
exports.createMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const newMessage = await Message.create({
      name,
      email,
      phone,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update message status
// @route   PUT /api/messages/:id
// @access  Private/Admin
exports.updateMessageStatus = async (req, res, next) => {
  try {
    let message = await Message.findById(req.params.id);

    if (!message) {
      return next(new ErrorResponse(`Message not found with id of ${req.params.id}`, 404));
    }

    message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return next(new ErrorResponse(`Message not found with id of ${req.params.id}`, 404));
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
