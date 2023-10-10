import React from 'react'
import { message } from 'server/types'
import 'views/Chat/styles/Chat.css'

interface IProps {
  message: message
  userName: string
}

const Message: React.FC<IProps> = ({ message, userName }) => {
  return (
    <div
      className="message"
      style={
        message.sender === userName
          ? { background: '#222' }
          : { background: '#2229' }
      }
    >
      <div className="message-left-side">
        <strong style={{ color: '#EF6262' }}>{message.sender}</strong>:{' '}
        {message.text}
      </div>
      <div className="message-right-side">{message.time}</div>
    </div>
  )
}
export default Message
