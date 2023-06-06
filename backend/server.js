const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const morgan = require("morgan");
const cors = require("cors");
const io = new Server(httpServer, { cors: "*" });

const route = require("./routes/route");
const connectedUser = require("./listeners/connectedUser");
const chatMessage = require("./listeners/chatMessage");
const onDisconnect = require("./listeners/onDisconnect");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api", route);

let onlineUsers = [];

const onConnection = (socket) => {
  connectedUser(socket, onlineUsers);
  chatMessage(socket, io, onlineUsers);
  onDisconnect(socket, onlineUsers);
};
io.on("connection", onConnection);

const PORT = 5000;

httpServer.listen(PORT, () => console.log(`listening on port ${PORT}`));
