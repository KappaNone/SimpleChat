"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const rooms = [];
const generateRoomKey = () => {
    const keyLength = 6;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";
    for (let i = 0; i < keyLength; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
};
const removeEmptyRooms = (lastUserInRoom) => {
    for (let i = rooms.length - 1; i >= 0; i--) {
        if (rooms[i].users.length === 0) {
            console.log(`Room ${rooms[i].key} has been removed by ${lastUserInRoom}`);
            rooms.splice(i, 1);
        }
    }
};
function findRoomByKey(roomKey) {
    return rooms.findIndex((room) => room.key === roomKey);
}
function socket() {
    index_1.io.on("connection", (socket) => {
        socket.on("createRoom", (createRoomRequest) => {
            const roomKey = generateRoomKey();
            const newRoom = {
                key: roomKey,
                users: [createRoomRequest.userName],
                visibility: createRoomRequest.roomVisibility,
            };
            // Add new room
            rooms.push(newRoom);
            // Return response on client
            const createRoomResponse = {
                userName: createRoomRequest.userName,
                roomKey: roomKey,
            };
            socket.emit("roomCreated", createRoomResponse);
            console.log(`Room ${roomKey} created by ${createRoomRequest.userName}`);
            // Update rooms page
            index_1.io.emit("updateRooms", rooms);
        });
        socket.on("updateRooms", () => {
            socket.emit("updateRooms", rooms);
        });
        socket.on("joinRoom", (joinRoomRequest) => {
            const roomKey = joinRoomRequest.roomKey;
            const room = rooms[findRoomByKey(roomKey)];
            if (room) {
                socket.join(roomKey);
                console.log(`User ${joinRoomRequest.userName} joined room: ${roomKey}`);
                room.users.push(joinRoomRequest.userName);
                const joinRoomResponse = {
                    roomUsers: room.users,
                    roomKey: roomKey,
                    joinedUser: joinRoomRequest.userName,
                };
                index_1.io.to(roomKey).emit("userJoined", joinRoomResponse);
                index_1.io.emit("updateRooms", rooms);
            }
            else {
                socket.emit("roomNotFound", { message: "Chat not found" });
                console.log(`Room ${roomKey} not found`);
            }
        });
        socket.on("join", (roomKey) => {
            socket.join(roomKey);
        });
        socket.on("message", (message) => {
            console.log("Message received:", message);
            socket.broadcast.to(message.roomKey).emit("message", message);
        });
        socket.on("leaveRoom", (leaveRoomRequest) => {
            const room = rooms[findRoomByKey(leaveRoomRequest.roomKey)];
            if (room) {
                socket.leave(leaveRoomRequest.roomKey);
                const disconectedUserIndex = room.users.indexOf(leaveRoomRequest.userName);
                if (disconectedUserIndex !== -1) {
                    room.users.splice(disconectedUserIndex, 1);
                    const leaveRoomResponse = {
                        roomUsers: room.users,
                        roomKey: leaveRoomRequest.roomKey,
                        userName: leaveRoomRequest.userName,
                    };
                    socket
                        .to(leaveRoomRequest.roomKey)
                        .emit("leaveRoom", leaveRoomResponse);
                    console.log(`User ${leaveRoomRequest.userName} left room: ${leaveRoomRequest.roomKey}`);
                }
                removeEmptyRooms(leaveRoomRequest.userName);
                index_1.io.emit("updateRooms", rooms);
            }
        });
    });
}
exports.default = socket;
