import { io } from "./index";
import { Socket } from "socket.io";
import {
  createRoomRequest,
  createRoomResponse,
  joinRoomResponse,
  joinRoomRequest,
  leaveRoomRequest,
  leaveRoomResponse,
  room,
  message,
} from "./types";

const rooms: room[] = [];

const generateRoomKey = (): string => {
  const keyLength = 6;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < keyLength; i++) {
    key += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return key;
};

const removeEmptyRooms = (lastUserInRoom: string): void => {
  for (let i = rooms.length - 1; i >= 0; i--) {
    if (rooms[i].users.length === 0) {
      console.log(`Room ${rooms[i].key} has been removed by ${lastUserInRoom}`);
      rooms.splice(i, 1);
    }
  }
};

function findRoomByKey(roomKey: string): number {
  return rooms.findIndex((room) => room.key === roomKey);
}

function socket() {
  io.on("connection", (socket: Socket) => {
    socket.on("createRoom", (createRoomRequest: createRoomRequest) => {
      const roomKey = generateRoomKey();
      const newRoom = {
        key: roomKey,
        users: [createRoomRequest.userName],
        visibility: createRoomRequest.roomVisibility,
      };
      // Add new room
      rooms.push(newRoom);
      // Return response on client
      const createRoomResponse: createRoomResponse = {
        userName: createRoomRequest.userName,
        roomKey: roomKey,
      };
      socket.emit("roomCreated", createRoomResponse);
      console.log(`Room ${roomKey} created by ${createRoomRequest.userName}`);
      // Update rooms page
      io.emit("updateRooms", rooms);
    });

    socket.on("updateRooms", () => {
      socket.emit("updateRooms", rooms);
    });

    socket.on("joinRoom", (joinRoomRequest: joinRoomRequest) => {
      const roomKey = joinRoomRequest.roomKey;
      const room = rooms[findRoomByKey(roomKey)];
      if (room) {
        socket.join(roomKey);
        console.log(`User ${joinRoomRequest.userName} joined room: ${roomKey}`);
        room.users.push(joinRoomRequest.userName);

        const joinRoomResponse: joinRoomResponse = {
          roomUsers: room.users,
          roomKey: roomKey,
          joinedUser: joinRoomRequest.userName,
        };
        io.to(roomKey).emit("userJoined", joinRoomResponse);

        io.emit("updateRooms", rooms);
      } else {
        socket.emit("roomNotFound", { message: "Chat not found" });
        console.log(`Room ${roomKey} not found`);
      }
    });

    socket.on("join", (roomKey) => {
      socket.join(roomKey);
    });

    socket.on("message", (message: message) => {
      console.log("Message received:", message);

      socket.broadcast.to(message.roomKey).emit("message", message);
    });

    socket.on("leaveRoom", (leaveRoomRequest: leaveRoomRequest) => {
      const room = rooms[findRoomByKey(leaveRoomRequest.roomKey)];

      if (room) {
        socket.leave(leaveRoomRequest.roomKey);
        const disconectedUserIndex = room.users.indexOf(
          leaveRoomRequest.userName
        );
        if (disconectedUserIndex !== -1) {
          room.users.splice(disconectedUserIndex, 1);
          const leaveRoomResponse: leaveRoomResponse = {
            roomUsers: room.users,
            roomKey: leaveRoomRequest.roomKey,
            userName: leaveRoomRequest.userName,
          };
          socket
            .to(leaveRoomRequest.roomKey)
            .emit("leaveRoom", leaveRoomResponse);
          console.log(
            `User ${leaveRoomRequest.userName} left room: ${leaveRoomRequest.roomKey}`
          );
        }
        removeEmptyRooms(leaveRoomRequest.userName);
        io.emit("updateRooms", rooms);
      }
    });
  });
}

export default socket;
