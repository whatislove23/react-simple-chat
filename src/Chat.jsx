import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

function Chat({ socket, userName, room, message, setVisible }) {
  const [currMessage, setCurrMessage] = useState("");
  const [messages, setMessages] = useState([message]);
  let chatWindow = useRef(null);
  let scrollDown = () => {
    chatWindow.current.scroll({ behavior: "smooth", top: 387 });
  };
  useEffect(() => {
    socket.on("recive_message", (data) => {
      setMessages((messages) => [...messages, data]);
      scrollDown();
    });
    socket.on("recive_notification", (data) => {
      console.log("Recived messages", data);
      setMessages((prev) => [...prev, data]);
    });
  }, [socket]);

  const leaveRoom = () => {
    socket.emit("left_room", room);
    setMessages([]);
    setVisible(false);
  };

  const sendMessage = async () => {
    if (currMessage !== "") {
      const data = {
        room: room,
        author: userName,
        message: currMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", data);
      setMessages((messages) => [...messages, data]);
    }
  };
  return (
    <div className="container mx-2 text-center flex flex-col  gap-2 bg-gray-500 text-white shadow-2xl overflow-hidden  rounded-md max-w-2xl">
      <div className="bg-gray-600 p-3 ">
        <div className="flex justify-between w-full items-center ">
          <div className="text-3xl font-extrabold text-center w-full ">
            Live chat
          </div>
          <button
            className="justify-self-end font-extrabold"
            onClick={leaveRoom}
          >
            &#9587;
          </button>
        </div>
        <div className="text-sm">Room {room}</div>
      </div>
      <div
        className="bg-gray-100 overflow-hidden overflow-y-scroll mx-2 rounded-md  flex flex-col h-96 "
        ref={chatWindow}
      >
        {messages.map((message, index) => {
          return (
            <div
              key={index}
              className={[
                "rounded-md",
                "shadow",
                "flex",
                "flex-col",
                "max-w-xl",
                "p-2",
                "m-2",
                "text-lg",
                "break-all",
                "text-left",
                userName === message.author
                  ? "bg-green-600 justify-self-end self-end"
                  : "bg-blue-500   justify-self-start self-start",
                message.notification &&
                  "bg-yellow-500 justify-center self-center text-lg w-60 text-center",
              ].join(" ")}
            >
              <div className="">{message.message} </div>
              <div className=" flex gap-2 text-xs ">
                <div className="">
                  {message.author} {!message.notification && "at:"}{" "}
                </div>
                <div>{!message.notification && message.time}</div>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="w-full flex justify-self-end self-end"
      >
        <input
          type="text"
          value={currMessage}
          onChange={(e) => setCurrMessage(e.target.value)}
          className="placeholder-gray-300 text-black p-3 w-full text-xl rounded-none"
          placeholder="Say something.."
          autofocus
        />
        <button
          onClick={() => {
            scrollDown();
            sendMessage();
            setCurrMessage("");
          }}
          className="bg-green-600  h-auto text-white shadow-2xl font-extrabold p-3 text-2xl"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
