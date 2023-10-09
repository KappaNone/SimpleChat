"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = 5000;
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "https://simplechat-5no6.onrender.com",
        methods: ["GET", "POST"],
    },
});
const socket_1 = __importDefault(require("./socket"));
(0, socket_1.default)();
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
