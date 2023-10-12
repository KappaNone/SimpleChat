import { Link, useLocation } from 'wouter'
import { useAtom } from 'jotai'
import { roomKeyAtom, userNameAtom, usersInRoomAtom } from 'atoms'
import './Styles/Main.css'
import { Socket, io } from 'socket.io-client'
import { useState } from 'react'
import { createRoomRequest, createRoomResponse } from 'server/types'

import MadeBy from 'components/MadeBy'


import { serverUrl } from 'utils'
const socket: Socket = io(serverUrl)

const Main = () => {
  const [userName, setUserName] = useAtom(userNameAtom)
  const [, setCreatedRoomKey] = useAtom(roomKeyAtom)
  const [, setUsersInRoom] = useAtom(usersInRoomAtom)
  const [roomVisibility, setRoomVisibility] = useState(false)
  const [, setLocation] = useLocation()

  function onRoomCreated(createRoomResponse: createRoomResponse) {
    setCreatedRoomKey(createRoomResponse.roomKey)
    setUsersInRoom([createRoomResponse.userName])
    setLocation(`/chat/${createRoomResponse.roomKey}`)
  }

  const createRoom = () => {
    const createRoomRequest: createRoomRequest = { userName, roomVisibility }
    socket.emit('createRoom', createRoomRequest)
    socket.on('roomCreated', onRoomCreated)
  }

  const inputValidation = () => userName.trim() === ''

  return (
    <div className="container">
      <div className="login-card">
        <div className="header">
          <span className="simple">Simple</span>
          <span className="chat">Chat</span> <br />
          <span className="discription">
            This is a simple chat that I made to learn socket.io
          </span>
        </div>
        <div className="inputs">
          <div className="username-input">
            <span>Username</span>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="checkBox-container">
            <input
              type="checkbox"
              id="checkbox"
              checked={roomVisibility}
              style={{ display: 'none' }}
              onChange={() => null}
            />
            <label
              className="toggle"
              onClick={() => setRoomVisibility(!roomVisibility)}
            >
              <span></span>
            </label>
            <span>{roomVisibility ? 'Public' : 'Private'}</span>
          </div>
        </div>
        <div className="buttons">
          <button
            className="createRoom-button"
            disabled={inputValidation()}
            onClick={createRoom}
          >
            Create a Chat
          </button>
          OR
          <Link href="/joinChat">
            <button className="secondary-button">Join Chat</button>
          </Link>
          <Link href="/rooms">
            <button className="secondary-button">Rooms</button>
          </Link>
        </div>
      </div>
      <MadeBy />
    </div>
  )
}
export default Main
