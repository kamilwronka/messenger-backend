const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  }
});

module.exports = ParticipantSchema;
