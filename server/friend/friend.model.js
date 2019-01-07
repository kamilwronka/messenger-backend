const mongoose = require("mongoose");
const participant = require("../conversationParticipant/conversationParticipant.model");
const message = require("../messages/messages.model");

const FriendSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  }
});

module.exports = FriendSchema;
