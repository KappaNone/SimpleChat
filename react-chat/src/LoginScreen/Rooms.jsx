

import './styles/Login.css';
import io from 'socket.io-client';
import RoomComponent from '../Components/RoomComponent/RoomComponent';
import { useEffect, useState } from 'react';
const socket = io('https://simple-chat-server-shrq.onrender.com');

function Room() {

  const [rooms, setRooms] = useState([])

  window.addEventListener('load', () => {
    socket.emit('updateRooms')
  })

  useEffect(() => {
    socket.emit('updateRooms');
    socket.on('updateRooms', (data) => {
      const roomsArray = []
      for (const key in data.rooms) {
        roomsArray.push(data.rooms[key]);
      }
      setRooms(roomsArray);
    });


    return () => {
      socket.off('updateRooms');
    };
  }, []);




  return (
    <>
      <div className="container">
        <div className="rooms-card">
          <h1 className='rooms-header'>Rooms:</h1>
          {rooms.map((room, index) => (


            <RoomComponent
              key={index}
              roomId={room.key}
              amountOfUsers={room.users.length}
              visibility={room.visibility}>
            </RoomComponent>


          ))}




        </div>
        <p className="madeBy">made with ❤️ by&nbsp;
          <a href="https://github.com/KappaNone">
            <span className="kappa">
              Kappa
            </span>

            <span className="none">
              None
            </span>
          </a>
        </p>
      </div>
    </>
  )
}

export default Room;