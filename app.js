const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

// chat
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://portfolio-frontend-brown-eight.vercel.app",
  ], // Replace with your actual frontend domain
  // methods: ["GET", "POST"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
};
const app = express();
app.use(express.json());
app.use(cors(corsOptions));
const userRoutes = require("./routes/userRoutes");
const heroRoutes = require("./routes/heroRoutes");
const gridItemsRoutes = require("./routes/GridItemRoutes");
const primarySkillRoutes = require("./routes/primarySkillRoutes");
const projectRoutes = require("./routes/projectRoutes");
const experienceRouter = require("./routes/experienceRoutes");
const footerRoutes = require("./routes/footerRoutes");
const profileRoutes = require("./routes/profileRoutes");
const resumeRouter = require("./routes/resumeRoutes");
const chatRouter = require("./routes/chatRoutes");
const MessageSchema = require("./model/MessageSchema");
//user
app.use("/api/user", userRoutes);
// hero
app.use("/api/hero", heroRoutes);
//about grid
app.use("/api/aboutgriditems", gridItemsRoutes);
// skill
app.use("/api/primaryskills", primarySkillRoutes);
// projects
app.use("/api/projects", projectRoutes);
//experience
app.use("/api/experience", experienceRouter);
// footer
app.use("/api/footer", footerRoutes);
//Profile
app.use("/api/profile", profileRoutes);
//resume
app.use("/api/resume", resumeRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const url = process.env.MONGO_DB;
const port = "8080";
console.log("Hello world");

//chat
app.use("/api/chat", chatRouter);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://portfolio-frontend-brown-eight.vercel.app",
    ], // Replace with your actual frontend domain
    // methods: ["GET", "POST"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  },
  transports: ["polling"],
});

io.on("connection", (socket) => {
  // console.log("New Client connected");

  socket.on("join", ({ userId, chatroomId }) => {
    socket.join(chatroomId);
    // console.log(`${userId} joined chatroom ${chatroomId}`);
  });
  socket.on("message", async ({ chatroomId, message }) => {
    io.to(chatroomId).emit("message", message);
    const newMessage = new MessageSchema({
      chatroomId,
      user: message.userId,
      message: message.message,
      timestamp: new Date(),
    });
    await newMessage.save();
    // Emit notification to the recipient user
    const [userId1, userId2] = chatroomId.split("_").slice(1);
    const recipientId = userId1 === message.userId ? userId2 : userId1;
    io.to(`user_${recipientId}`).emit("notification", {
      chatroomId,
      message,
    });
  });
  // WebRTC signaling
  socket.on("call-user", (data) => {
    console.log(`Calling user ${data.userToCall} from ${data.from}`);
    io.to(data.userToCall).emit("call-user", {
      signal: data.signal,
      from: data.from,
      isVideoCall: data.isVideoCall,
    });
  });

  socket.on("answer-call", (data) => {
    console.log(`Answering call from ${data.to}`);
    io.to(data.to).emit("call-accepted", data.signal);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

//

mongoose
  .connect(url)
  .then((res) => server.listen(port))
  .then((res) => console.log("DB connected"))
  .catch((er) => console.log(er));
