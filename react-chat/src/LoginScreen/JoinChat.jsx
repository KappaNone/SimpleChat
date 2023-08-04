import './styles/Login.css';

import io from 'socket.io-client';
import { useLocation } from 'wouter';
import { createdRoomKeyAtom, userNameAtom, usersInRoomAtom, } from '../Atoms';
import { useAtom } from 'jotai';
import { useState } from 'react';
const socket = io('https://simple-chat-server-shrq.onrender.com');

function JoinChat() {
  const [roomId, setRoomId] = useAtom(createdRoomKeyAtom);
  const [userName, setUserName] = useAtom(userNameAtom)
  const [, setUsersInRoom] = useAtom(usersInRoomAtom)
  const [error, setError] = useState('')
  const [, setLocation] = useLocation();

  const inputValidation = () => { if (userName.trim() !== '' && roomId.trim() !== '') return true }

  const joinRoom = () => {
    socket.emit('joinRoom', { key: roomId, userName: userName });
    socket.on('roomNotFound', (data) => {
      setError(data.message);
      setUserName('');
      setRoomId('');
    });

    socket.on('userJoined', (data) => {
      setUsersInRoom(data.roomUsers)
      setRoomId(data.key)
      setError('')
      setLocation(`/chat/${roomId}`);
    });
  };

  return (
    <div className="container">
      <div className="login-card" style={{ height: '200px' }}>
        <div className="inputs" style={{}}>
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
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>
        </div>
        <div className="buttons">
          <div> {error} <br /></div>
            <button className="joinRoom-button" disabled={!inputValidation()} onClick={joinRoom}>Join</button>
        </div>
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
  );
}

export default JoinChat;