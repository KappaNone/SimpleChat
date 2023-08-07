import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { userNameAtom, usersInRoomAtom } from '../Atoms';
import { useAtom } from 'jotai';
import PropTypes from 'prop-types'
import './styles/Chat.css'
import toast, { Toaster } from 'react-hot-toast';

const socket = io.connect('https://simple-chat-server-shrq.onrender.com');

function Chat({ roomId }) {
  const [usersInRoom, setUsersInRoom] = useAtom(usersInRoomAtom)
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userName] = useAtom(userNameAtom);

  window.addEventListener('beforeunload', () => {
    socket.emit('disconectUser', { disconectedUser: userName, roomUsers: usersInRoom, roomId: roomId })
  })

  useEffect(() => {
    socket.on('message', (data) => {
      if (data.roomKey === roomId) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });
    socket.on('userJoined', (data) => {
      if (data.roomId === roomId) {
        setUsersInRoom(data.roomUsers);
        toast(`User ${data.joinedUser} joined!`, {
          duration: 4000,
          position: 'bottom-center',
          style: { backgroundColor: '#333', color: '#F0F0F0' },

          ariaProps: {
            role: 'status',
            'aria-live': 'polite',
          },
        });
      }
    });

    socket.on('userDisconected', (data) => {
      if (data.roomId === roomId) {
        setUsersInRoom(data.roomUsers)
        toast(`User ${data.disconectedUser} disconected.`, {
          duration: 4000,
          position: 'bottom-center',
          style: { backgroundColor: '#333', color: '#F0F0F0' },

          ariaProps: {
            role: 'status',
            'aria-live': 'polite',
          },
        });
      }
    })

    return () => {
      socket.off('userDisconected')
      socket.off('message');
      socket.off('userJoined');
    };

  }, [roomId, messages, setUsersInRoom]);

  function sendMessage() {
    if (inputMessage.trim() !== '') {
      socket.emit('message', {
        roomKey: roomId,
        text: inputMessage,
        sender: userName,
      });
      setInputMessage('');
    }
  }

  return (
    <>
      <Toaster />
      <div className='leftSide'>
        <h1 className='chatID'>ChatID: {roomId}</h1>
        <div className='userList'>
          {usersInRoom?.map((user, index) => (
            <div key={index}>
              <div>{user}<br /></div>
            </div>
          ))}
        </div>
      </div>
      <div className='chat-container'>
        <div className='chat-card'>
          <div className='chat'>

            <div className='messages' >
              {messages.map((message, index) => (
                <div key={index} className='message'>
                  <strong style={{ color: '#EF6262' }}>{message.sender}</strong>: {message.text}
                </div>
              ))}
            </div>

          </div>
          <div className='chat-input'>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
            />
            <button className='sendMessage-button' onClick={sendMessage}></button>
          </div>
        </div>
      </div>
    </>
  );
}

Chat.propTypes = {
  roomId: PropTypes.string
}

export default Chat;
