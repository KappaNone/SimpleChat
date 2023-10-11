import '../Main/Styles/Main.css'
import { Socket, io } from 'socket.io-client'

import { useEffect, useState } from 'react'

import MadeBy from 'components/MadeBy'
import Room from 'components/Room/Room'
import { room } from 'server/types'

const socket: Socket = io('https://simple-chat-server-shrq.onrender.com')
const Rooms = () => {
  const [rooms, setRooms] = useState<room[]>([])

  useEffect(() => {
    function onUpdateRooms(rooms: room[]) {
      console.log(rooms)
      setRooms(rooms)
    }
    socket.emit('updateRooms')
    socket.on('updateRooms', onUpdateRooms)

    return () => {
      socket.off('updateRooms', onUpdateRooms)
    }
  }, [])

  return (
    <div className="container">
      <div className="rooms-card">
        <h1 className="rooms-header">Rooms:</h1>

        {rooms.map((room) => (
          <Room
            key={room.key}
            roomKey={room.key}
            amountOfUsers={room.users.length}
            visibility={room.visibility}
          ></Room>
        ))}
      </div>
      <MadeBy />
    </div>
  )
}
export default Rooms
