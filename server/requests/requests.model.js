const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    type: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const RequestModel = mongoose.model("Request", RequestSchema);

module.exports = RequestModel;
