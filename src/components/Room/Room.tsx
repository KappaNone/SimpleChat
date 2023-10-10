import './Styles/Room.css'
import React from 'react'
import { useAtom } from 'jotai'
import { useLocation } from 'wouter'
import { roomKeyAtom } from 'atoms'


interface IProps {
  roomKey: string
  amountOfUsers: number
  visibility: boolean
}

const Room: React.FC<IProps> = ({ roomKey, amountOfUsers, visibility }) => {
  const [, setRoomKey] = useAtom(roomKeyAtom)
  const [, setLocation] = useLocation()
  function joinRoom() {
    setRoomKey(roomKey)
    setLocation('/joinChat')
  }

  return (
    <>
      {visibility && (
        <div className="room" onClick={joinRoom}>
          <div className="contentContainer">
            <div className="roomId">{roomKey}</div>
            <div className="amountOfUsers">{amountOfUsers}</div>
          </div>
        </div>
      )}
    </>
  )
}
export default Room
