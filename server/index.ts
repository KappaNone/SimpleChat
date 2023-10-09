import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const PORT = 5000;

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

import socket from "./socket";
socket();

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
