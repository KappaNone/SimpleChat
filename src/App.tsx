import { Route } from "wouter";
import Main from "./views/Main/Main";
import Rooms from "./views/Rooms/Rooms";
import Chat from "./views/Chat/Chat";
import JoinChat from "./views/JoinChat/JoinChat";
const App = () => {
  return (
    <>
      <Route path="/">
        <Main />
      </Route>

      <Route path="/joinChat">
        <JoinChat />
      </Route>

      <Route path="/rooms">
        <Rooms />
      </Route>

      <Route path="/chat/:createdRoomKey">
        {(params) => <Chat roomKey={params.createdRoomKey} />}
      </Route>
    </>
  );
};
export default App;
