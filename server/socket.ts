import { io } from './index'
import { Socket } from 'socket.io'
import { generateRoomKey, removeEmptyRooms, findRoomByKey } from './utils'
import {
  createRoomRequest,
  createRoomResponse,
  joinRoomResponse,
  joinRoomRequest,
  leaveRoomRequest,
  leaveRoomResponse,
  room,
  message,
} from './types'

const rooms: room[] = []

function socket() {
  io.on('connection', (socket: Socket) => {
    socket.on('createRoom', (createRoomRequest: createRoomRequest) => {
      const roomKey = generateRoomKey()
      const newRoom = {
        key: roomKey,
        users: [createRoomRequest.userName],
        visibility: createRoomRequest.roomVisibility,
      }

      rooms.push(newRoom)

      const createRoomResponse: createRoomResponse = {
        userName: createRoomRequest.userName,
        roomKey: roomKey,
      }
      socket.emit('roomCreated', createRoomResponse)
      console.log(`Room ${roomKey} created by ${createRoomRequest.userName}`)

      io.emit('updateRooms', rooms)
    })

    socket.on('updateRooms', () => {
      socket.emit('updateRooms', rooms)
    })

    socket.on('joinRoom', (joinRoomRequest: joinRoomRequest) => {
      const roomKey = joinRoomRequest.roomKey
      const room = rooms[findRoomByKey(rooms, roomKey)]
      if (room) {
        socket.join(roomKey)
        console.log(`User ${joinRoomRequest.userName} joined room: ${roomKey}`)
        room.users.push(joinRoomRequest.userName)

        const joinRoomResponse: joinRoomResponse = {
          roomUsers: room.users,
          roomKey: roomKey,
          joinedUser: joinRoomRequest.userName,
        }
        io.to(roomKey).emit('userJoined', joinRoomResponse)

        io.emit('updateRooms', rooms)
      } else {
        socket.emit('roomNotFound', { message: 'Chat not found' })
        console.log(`Room ${roomKey} not found`)
      }
    })

    socket.on('join', (roomKey) => {
      socket.join(roomKey)
    })

    socket.on('message', (message: message) => {
      console.log('Message received:', message)

      socket.broadcast.to(message.roomKey).emit('message', message)
    })

    socket.on('leaveRoom', (leaveRoomRequest: leaveRoomRequest) => {
      const room = rooms[findRoomByKey(rooms, leaveRoomRequest.roomKey)]

      if (room) {
        socket.leave(leaveRoomRequest.roomKey)
        const disconectedUserIndex = room.users.indexOf(
          leaveRoomRequest.userName,
        )
        if (disconectedUserIndex !== -1) {
          room.users.splice(disconectedUserIndex, 1)
          const leaveRoomResponse: leaveRoomResponse = {
            roomUsers: room.users,
            roomKey: leaveRoomRequest.roomKey,
            userName: leaveRoomRequest.userName,
          }
          socket.to(leaveRoomRequest.roomKey).emit('leaveRoom', leaveRoomResponse)
          console.log(`User ${leaveRoomRequest.userName} left room: ${leaveRoomRequest.roomKey}`)
        }
        removeEmptyRooms(rooms, leaveRoomRequest.userName)
        io.emit('updateRooms', rooms)
      }
    })
  })
}

export default socket
