const Chat = require("../model/ChatSchema");
const { User } = require("../model/User");
exports.getRecentChatUsers = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you get user ID from request params
    // Find recent chats involving the user
    const recentChats = await Chat.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ timestamp: -1 })
      .limit(10) // Adjust the number of recent chats as needed
      .populate({
        path: "sender receiver",
        select: "name profile",
        populate: {
          path: "profile",
          select: "profilePicture",
        },
      });

    // Extract unique user IDs from recent chats
    const recentChatUsers = new Set();
    recentChats.forEach((chat) => {
      if (chat.sender._id.toString() !== userId.toString()) {
        recentChatUsers.add(chat.sender);
      }
      if (chat.receiver._id.toString() !== userId.toString()) {
        recentChatUsers.add(chat.receiver);
      }
    });
    res.status(200).json({ data: Array.from(recentChatUsers) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.createChatMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newChat = new Chat({
      sender: senderId,
      receiver: receiverId,
      message,
    });

    await newChat.save();

    res.status(201).json({ message: "Chat message created", data: newChat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
