const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  messageContent: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  read: {
    type: Boolean,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    required: false
  }
});

module.exports = MessageSchema;
