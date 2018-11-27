const mongoose = require("mongoose");
const participant = require("../conversationParticipant/conversationParticipant.model");
const message = require("../messages/messages.model");

const FriendSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  avatar: {
    type: String,
    required: false
  },
  status: {
    type: Boolean,
    required: true
  }
});

module.exports = FriendSchema;
