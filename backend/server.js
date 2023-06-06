const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const io = new Server(httpServer, { cors: "*" });

const route = require("./routes/route");
const listeners = require("./listeners/listeners");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api", route);

// let onlineUsers = [];
// const onlineUsers = require("./listeners/onlineUsers");

const onConnection = (socket) => {
  listeners(socket, io);
};
io.on("connection", onConnection);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`listening on port ${PORT}`));
