import "normalize.css";
import "./App.css";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import Entrance from "./Entrance";

const socket = io.connect(`https://chat-react-api.herokuapp.com/`);
const rooms = [1, 2];

function App() {
  const [userName, setUserName] = useState("");
  const [joinMessage, setMessage] = useState("");
  const [isVisible, setVisible] = useState(false);
  const [room, setRoom] = useState("");
  const [countOfUsers, setCount] = useState([]);
  useEffect(() => {
    socket.on("recive_leng", (data) => {
      setCount(data);
      console.log("Count of users in rooms", data);
    });
  }, [socket, isVisible]);

  return (
    <div className="flex items-center justify-center h-screen">
      {!isVisible ? (
        <Entrance
          rooms={rooms}
          setUserName={setUserName}
          userName={userName}
          room={room}
          setRoom={setRoom}
          countOfUsers={countOfUsers}
          socket={socket}
          setMessage={setMessage}
          setVisible={setVisible}
        />
      ) : (
        <Chat
          socket={socket}
          userName={userName}
          room={room}
          message={joinMessage}
          setVisible={setVisible}
        />
      )}
    </div>
  );
}

export default App;
