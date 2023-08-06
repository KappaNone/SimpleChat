const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require("cors")
const app = express();

app.use(cors())

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "https://simplechat-5no6.onrender.com",
    methods: ["GET", "POST"],
  },
})

const PORT = 5000;


const rooms = {};


io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  const generateRoomKey = () => {
    const keyLength = 6;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < keyLength; i++) {
      key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
  };
  const removeEmptyRooms = () => {
    for (const roomKey in rooms) {
      if (rooms.hasOwnProperty(roomKey)) {
        const room = rooms[roomKey];
        if (room.users.length === 0) {
          delete rooms[roomKey];
          console.log('Room removed:', roomKey);
        }
      }
    }
  };

  socket.on('createRoom', (data) => {

    const roomKey = generateRoomKey();

    const newRoom = {
      key: roomKey,
      users: [data.userName],
      visibility: data.visibility
    };


    rooms[roomKey] = newRoom;

    socket.join(roomKey);

    socket.emit('roomCreated', { key: roomKey, userName: data.userName });
    console.log('Room created:', roomKey);
    io.emit('updateRooms', { rooms })
  });

  socket.on('joinRoom', (data) => {
    const { key } = data;
    const room = rooms[key];
    if (room) {

      socket.join(key);


      room.users.push(data.userName)
      console.log('User joined room:', key);


      io.emit('userJoined', { roomUsers: room.users, roomId: key, joinedUser: data.userName });
      console.log('Room found: ')
      console.log(room)
      io.emit('updateRooms', { rooms })
    } else {
      socket.emit('roomNotFound', { message: 'Chat not found' });
      console.log(`Room ${key} not found`)
    }
    
  });

  socket.on('message', (data) => {
    console.log('Message received:', data);
    io.emit('message', data);
    console.log(rooms);
  });

  socket.on('updateRooms', () => {
    socket.emit('updateRooms', { rooms })
  })

  socket.on('disconectUser', (data) => {
    const room = rooms[data.roomId]

    if (room) {

      const disconectedUserIndex = room.users.indexOf(data.disconectedUser);
      if (disconectedUserIndex !== -1) {
        room.users.splice(disconectedUserIndex, 1)
        io.emit('userDisconected', { roomUsers: room.users, roomId: data.roomId, disconectedUser: data.disconectedUser });
      }
      removeEmptyRooms()
      io.emit('updateRooms', { rooms })
    }

    console.log(rooms)
  });

  socket.on('disconnect', () => {
    console.log(rooms)
  });
});


server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


