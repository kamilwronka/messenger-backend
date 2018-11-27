const mongoose = require("mongoose");
const participant = require("../conversationParticipant/conversationParticipant.model");
const message = require("../messages/messages.model");

const ConversationSchema = new mongoose.Schema({
  participants: [participant],
  messages: [message],
  color: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false
  }
});

module.exports = ConversationSchema;
