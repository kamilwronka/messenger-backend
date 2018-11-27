const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = MessageSchema;
