import './styles/Chat.css'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Socket, io } from 'socket.io-client'
import { useAtom } from 'jotai'
import { userNameAtom, usersInRoomAtom, roomKeyAtom } from 'atoms'
import { useLocation } from 'wouter'
import {
  message,
  joinRoomResponse,
  leaveRoomRequest,
  leaveRoomResponse
} from 'server/types'

import Message from 'components/Message'
import MessageInput from 'components/MessageInput'
import RoomUser from 'components/RoomUser'

interface IProps {
  roomKey: string
}

const socket: Socket = io(import.meta.env.APP_SERVER_URL)


const Chat: React.FC<IProps> = ({ roomKey }) => {
  const [messages, setMessages] = useState<message[]>([])
  const [userName] = useAtom(userNameAtom)
  const [roomUsers, setRoomUsers] = useAtom(usersInRoomAtom)
  const [, setRoomKey] = useAtom(roomKeyAtom)
  const [, setLocation] = useLocation()

  useEffect(() => {
    socket.emit('join', roomKey)
    return () => {
      socket.emit('join', roomKey)
    }
  }, [roomKey])

  useEffect(() => {
    function onLoad() {
        setRoomKey(roomKey)
        setLocation('/joinChat')
      }
    
    window.addEventListener('load', onLoad)
    return () => {
      window.removeEventListener('load', onLoad)
    }
  }, [roomKey, setLocation, setRoomKey])

  useEffect(() => {
    function onBeforeUnload() {
      const leaveRoomRequest: leaveRoomRequest = {
        userName,
        roomUsers,
        roomKey,
      }
      socket.emit('leaveRoom', leaveRoomRequest)
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [roomKey, roomUsers, userName])

  useEffect(() => {
    function onMessage(message: message) {
      setMessages((prevMessages) => [...prevMessages, message])
    }

    function onUserJoined(joinRoomResponse: joinRoomResponse) {
      setRoomUsers(joinRoomResponse.roomUsers)
      toast(`User ${joinRoomResponse.joinedUser} joined!`, {
        duration: 4000,
        position: 'bottom-center',
        style: { backgroundColor: '#333', color: '#F0F0F0' },
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      })
    }

    function onLeaveRoom(leaveRoomResponse: leaveRoomResponse) {
      setRoomUsers(leaveRoomResponse.roomUsers)
      toast(`User ${leaveRoomResponse.userName} disconected.`, {
        duration: 4000,
        position: 'bottom-center',
        style: { backgroundColor: '#333', color: '#F0F0F0' },
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      })
    }

    socket.on('message', onMessage)
    socket.on('userJoined', onUserJoined)
    socket.on('leaveRoom', onLeaveRoom)

    return () => {
      socket.off('message', onMessage)
      socket.off('userJoined', onUserJoined)
      socket.off('leaveRoom', onLeaveRoom)
    }
  }, [roomKey, setRoomUsers])

  return (
    <>
      <Toaster />
      <div className="leftSide">
        <h1 className="chatID">ChatID: {roomKey}</h1>
        <div className="userList">
          {roomUsers?.map((user, index) => (
            <RoomUser userName={userName} user={user} key={index}></RoomUser>
          ))}
        </div>
      </div>
      <div className="chat-container">
        <div className="chat-card">
          <div className="chat">
            <div className="messages">
              {messages.map((message, index) => (
                <Message
                  message={message}
                  userName={userName}
                  key={index}
                ></Message>
              ))}
            </div>
          </div>
          <div className="chat-input">
            <MessageInput roomKey={roomKey} userName={userName}></MessageInput>
          </div>
        </div>
      </div>
    </>
  )
}
export default Chat
