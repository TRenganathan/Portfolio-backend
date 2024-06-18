const express = require("express");
const MessageSchema = require("../model/MessageSchema");
const {
  getRecentChatUsers,
  createChatMessage,
} = require("../controllers/chatController");
const router = express.Router();

router.get("/:chatroomId", async (req, res) => {
  const { chatroomId } = req.params;
  try {
    const messages = await MessageSchema.find({ chatroomId }).sort("timestamp");
    res.json(messages);
  } catch (error) {
    res.status(400).send("Error fetching messages");
  }
});
router.get("/recent-chats/userId/:userId", getRecentChatUsers);
router.post("/send", createChatMessage);
module.exports = router;
