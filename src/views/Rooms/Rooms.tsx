import "../Main/Styles/Main.css";
import { Socket, io } from "socket.io-client";
import Room from "../../components/Room/Room";
import { useEffect, useState } from "react";
import { room } from "../../../server/types";

import MadeBy from "../../components/MadeBy";

const socket: Socket = io("http://localhost:5000");
const Rooms = () => {
  const [rooms, setRooms] = useState<room[]>([]);

  

  useEffect(() => {
    function onUpdateRooms(rooms: room[]) {
      console.log(rooms);
      setRooms(rooms);
    }
    socket.emit("updateRooms");
    socket.on("updateRooms", onUpdateRooms)

    return () => {
      socket.off("updateRooms", onUpdateRooms);
    };
  }, []);

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
  );
};
export default Rooms;
