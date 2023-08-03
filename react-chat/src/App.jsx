
import { Route } from "wouter";
import Login from './LoginScreen/Login';
import Chat from './ChatScreen/Chat';
import JoinChat from './LoginScreen/JoinChat';



const App = () => {



  return (
    <>
      <Route path='/'>
        <Login></Login>
      </Route>

      <Route path="/joinChat">
        <JoinChat></JoinChat>
      </Route>

      <Route path='/chat/:createdRoomKey'>

        {
          (params) =>
            <Chat roomId={params.createdRoomKey}>  </Chat>
        }
      </Route>

    </>
  );
};

export default App;
