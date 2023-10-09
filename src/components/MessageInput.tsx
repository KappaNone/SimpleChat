import { Socket, io } from "socket.io-client";
import { message } from "../../server/types";
import "../views/Chat/styles/Chat.css";
import React, { useState } from "react";

interface IProps {
  roomKey: string;
  userName: string;

}

const socket: Socket = io("http://localhost:5000");

const MessageInput: React.FC<IProps> = ({ roomKey, userName }) => {
  const [inputMessage, setInputMessage] = useState("");

  function sendMessage() {
    if (inputMessage.trim() !== "") {
      const currentDate = new Date();
      const hours = currentDate.getHours().toString();
      const minutes = currentDate.getMinutes();

      const formatMinutes = (minutes: number): string => {
        if (minutes < 10) {
          return `0${minutes}`;
        }
        return minutes.toString();
      };

      const message: message = {
        roomKey,
        text: inputMessage,
        sender: userName,
        time: `${hours}:${formatMinutes(minutes)}`,
      };

      socket.emit("message", message);
      setInputMessage("");
    }
  }

  return (
    <div className="chat-input">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />
      <button className="sendMessage-button" onClick={sendMessage}></button>
    </div>
  );
};
export default MessageInput;
