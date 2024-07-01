const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
// chat
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
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
const chatrooms = {};
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

  // socket.on("call-user", (data) => {
  //   console.log(`Calling user ${data.userToCall} from ${data.from}`);
  //   io.to(data.userToCall).emit("call-user", {
  //     signal: data.signal,
  //     from: data.from,
  //     isVideoCall: data.isVideoCall,
  //   });
  // });

  // socket.on("answer-call", (data) => {
  //   console.log(`Answering call from ${data.to}`);
  //   io.to(data.to).emit("call-accepted", data.signal);
  // });

  //
  // Register peer in chatroom
  // Join chatroom for messaging and video calling
  socket.on("join-chatroom", ({ userId, chatroomId, peerId }) => {
    console.log(
      `User ${userId} with Peer ID ${peerId} joining chatroom: ${chatroomId}`
    );

    socket.join(chatroomId);
    if (!chatrooms[chatroomId]) {
      chatrooms[chatroomId] = [];
    }

    // Check if the socket is already registered
    const existingPeer = chatrooms[chatroomId].find(
      (peer) => peer.socketId === socket.id
    );
    if (!existingPeer) {
      chatrooms[chatroomId].push({ socketId: socket.id, peerId });
    } else {
      // Update the existing peerId if the socket is already registered
      existingPeer.peerId = peerId;
    }

    console.log(chatrooms, "Current chatrooms state after joining chatroom");
  });

  // Handle call initiation
  socket.on("initiate-call", ({ chatroomId }) => {
    console.log(`Initiate call for chatroomId: ${chatroomId}`);
    const peersInRoom = chatrooms[chatroomId];
    console.log(peersInRoom, "Peers in room");

    if (peersInRoom && peersInRoom.length > 1) {
      const caller = peersInRoom.find((peer) => peer.socketId === socket.id);
      const callee = peersInRoom.find((peer) => peer.socketId !== socket.id);

      if (caller && callee) {
        io.to(callee.socketId).emit("incoming-call", {
          fromPeerId: caller.peerId,
        });
        console.log(`Call initiated from ${caller.peerId} to ${callee.peerId}`);
      } else {
        console.log("Caller or callee not found");
      }
    } else {
      console.log("Not enough peers in the room to initiate a call");
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    for (const room in chatrooms) {
      chatrooms[room] = chatrooms[room].filter(
        (peer) => peer.socketId !== socket.id
      );
      if (chatrooms[room].length === 0) {
        delete chatrooms[room];
      }
    }
    console.log("Client disconnected", socket.id);
  });
});

//

mongoose
  .connect(url)
  .then((res) => server.listen(port))
  .then((res) => console.log("DB connected"))
  .catch((er) => console.log(er));

const ioGroupVchat = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://portfolio-frontend-brown-eight.vercel.app",
    ], // Replace with your actual frontend domain
    // methods: ["GET", "POST"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  },
  transports: ["polling"],
  path: "/groupvchat",
});
app.get("/create-room", (req, res) => {
  const roomID = uuidv4();
  rooms[roomID] = [];
  res.json({ roomID });
});
const rooms = {};
let users = {};

const socketToRoom = {};
ioGroupVchat.on("connection", (socket) => {
  const Current_UserID = socket.handshake.query.userID;
  if (Current_UserID) {
    console.log(`New client connected: ${Current_UserID}`);

    socket.on("join room", ({ roomID, userID }) => {
      console.log(`User ${userID} joining room ${roomID}`);

      if (!rooms[roomID]) {
        rooms[roomID] = [];
      }
      rooms[roomID].push({ socketID: socket.id, userID });

      const otherUsers = rooms[roomID].filter(
        (user) => user.socketID !== socket.id
      );
      socket.emit(
        "all-users",
        otherUsers.map((user) => user.userID)
      );
    });

    socket.on("sending signal", ({ userToSignal, callerID, signal }) => {
      const roomID = Object.keys(rooms).find((roomID) =>
        rooms[roomID].some((user) => user.userID === userToSignal)
      );
      const user = rooms[roomID].find((user) => user.userID === userToSignal);

      if (user) {
        ioGroupVchat
          .to(user.socketID)
          .emit("user joined", { signal, callerID });
      }
    });

    socket.on("returning signal", ({ signal, callerID }) => {
      const roomID = Object.keys(rooms).find((roomID) =>
        rooms[roomID]?.some((user) => user.userID === callerID)
      );
      const user = rooms[roomID]?.find((user) => user.userID === callerID);

      if (user) {
        ioGroupVchat.to(user.socketID).emit("receiving returned signal", {
          signal,
          id: Current_UserID,
        });
      }
    });

    socket.on("media updation", ({ audio, video, id }) => {
      console.log(
        `Media update from ${id}: Audio - ${audio}, Video - ${video}`
      );
      // Handle media updates if needed
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${Current_UserID}`);
      for (const roomID in rooms) {
        rooms[roomID] = rooms[roomID].filter(
          (user) => user.socketID !== socket.id
        );
        if (rooms[roomID].length === 0) {
          delete rooms[roomID];
        }
      }
    });
  }
  // MY code
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  });
  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    // let room = users[roomID];
    // if (room) {
    //   room = room.filter((id) => id !== socket.id);
    //   users[roomID] = room;
    // }
  });
});
