import '../Main/Styles/Main.css'

import { Socket, io } from 'socket.io-client'
import { useAtom } from 'jotai'
import { useLocation } from 'wouter'
import { roomKeyAtom, userNameAtom, usersInRoomAtom, errorText } from 'atoms'
import { joinRoomRequest, joinRoomResponse, error } from 'server/types'

import MadeBy from 'components/MadeBy'


const socket: Socket = io('https://simple-chat-server-shrq.onrender.com')


const JoinChat = () => {
  const [roomKey, setRoomKey] = useAtom(roomKeyAtom)
  const [userName, setUserName] = useAtom(userNameAtom)
  const [, setUsersInRoom] = useAtom(usersInRoomAtom)
  const [error, setError] = useAtom(errorText)
  const [, setLocation] = useLocation()

  function onUserJoined(joinRoomResponse: joinRoomResponse) {
    setUsersInRoom(joinRoomResponse.roomUsers)
    setRoomKey(joinRoomResponse.roomKey)
    setError('')
    setLocation(`/chat/${roomKey}`)
  }

  function onError(error: error) {
    if (error.target === 'roomKey') {
      setRoomKey('')
    }
    if (error.target === 'userName') {
      setUserName('')
    }
    setError(error.message)
  }

  function joinRoom() {
    const joinRoomRequest: joinRoomRequest = {
      roomKey: roomKey,
      userName: userName,
    }

    socket.emit('joinRoom', joinRoomRequest)
    socket.on('joinError', onError)
    socket.on('userJoined', onUserJoined)
  }

  const inputValidation = () => {
    if (userName.trim() !== '' && roomKey.trim() !== '') return true
  }

  return (
    <div className="container">
      <div className="login-card" style={{ height: '200px' }}>
        <div className="inputs">
          <div className="username-input">
            <span>Username</span>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="roomId-input">
            <span>Room ID</span>
            <input
              type="text"
              value={roomKey}
              onChange={(e) => setRoomKey(e.target.value)}
            />
          </div>
        </div>
        <div className="buttons">
          <div>
            {' '}
            {error} <br />
          </div>
          <button
            className="secondary-button"
            disabled={!inputValidation()}
            onClick={joinRoom}
          >
            Join
          </button>
        </div>
      </div>
      <MadeBy />
    </div>
  )
}

export default JoinChat
