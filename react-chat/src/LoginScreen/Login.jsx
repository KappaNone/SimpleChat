import { Link, useLocation } from 'wouter'
import { useAtom } from 'jotai';
import { userNameAtom, createdRoomKeyAtom, usersInRoomAtom } from '../Atoms';
import './styles/Login.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');


function Login() {

  const [userName, setUserName] = useAtom(userNameAtom);
  const [, setCreatedRoomKey] = useAtom(createdRoomKeyAtom)
  const [, setUsersInRoom] = useAtom(usersInRoomAtom)
  const [, setLocation] = useLocation();

  const createRoom = () => {
    socket.emit('createRoom', { userName: userName });
    socket.on('roomCreated', (data) => {
      setCreatedRoomKey(data.key);
      setUsersInRoom([data.userName])
      setLocation(`/chat/${data.key}`);
    });
  };

  const inputValidation = () => userName.trim() === '';


  return (
    <>
      <div className="container">
        <div className="login-card">
          <div className="header">
            <span className="simple">Simple</span>
            <span className="chat">Chat</span> <br />
            <span className="discription">This is a simple chat that I made to learn socket.io</span>
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

          </div>
          <div className="buttons">
            <button className="createRoom-button" disabled={inputValidation()} onClick={createRoom}>Create a Chat</button> {/* Вызов функции при клике */}
            OR
            <Link href='/joinChat'>
              <button className="joinRoom-button">Join a Chat</button>
            </Link>
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
    </>
  )
}

export default Login;