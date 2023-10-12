import { Route } from "wouter";

import Main from "Main";
import Rooms from "Rooms";
import Chat from "Chat";
import JoinChat from "JoinChat";

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
