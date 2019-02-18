const mongoose = require("mongoose");
const participant = require("../conversationParticipant/conversationParticipant.model");
const message = require("../messages/messages.model");

const ConversationSchema = new mongoose.Schema(
  {
    participants: {
      type: Array,
      required: true,
      ref: "User"
    },
    messages: [message],
    emoji: {
      type: String,
      required: false
    },
    color: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

const ConversationModel = mongoose.model("Conversation", ConversationSchema);

module.exports = ConversationModel;
