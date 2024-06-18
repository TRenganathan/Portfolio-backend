const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  chatroomId: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
