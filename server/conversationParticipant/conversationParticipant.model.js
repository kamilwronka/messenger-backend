const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  }
});

module.exports = ParticipantSchema;
