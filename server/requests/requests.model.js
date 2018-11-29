const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  direction: {
    type: String,
    required: true
  }
});

module.exports = RequestSchema;