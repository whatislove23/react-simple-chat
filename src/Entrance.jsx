import React from "react";
export default function Entrance({
  userName,
  rooms,
  setUserName,
  setMessage,
  setRoom,
  socket,
  setVisible,
  countOfUsers,
}) {
  const joinRoom = (room) => {
    if (userName !== "") {
      setMessage({
        message: `You joined to room ${room}`,
        notification: true,
      });
      setRoom(room);
      socket.emit("join_room", { room, userName });
      setVisible(true);
    }
  };
  function getCount(countOfUsers, room) {
    for (let index = 0; index < countOfUsers.length; index++) {
      const element = countOfUsers[index];
      if (element.key === room) {
        console.log(element);
        return element.length;
      }
    }
    return 0;
  }
  return (
    <div className="text-center flex flex-col justify-center items-center gap-6 bg-gray-500 p-5 text-white shadow-2xl w-72 rounded-md  sm:h-96 sm:w-96">
      <h1 className="text-3xl font-extrabold xl:text-4xl">Join chat</h1>
      <input
        type="text"
        placeholder="User name"
        onChange={(e) => setUserName(e.target.value)}
        className="w-full bg-transparent placeholder-gray-300 text-xl xl:text-2xl"
      />
      {rooms.map((room, index) => {
        return (
          <button
            onClick={() => joinRoom(room)}
            key={room}
            className="bg-yellow-400 w-full h-8 text-white rounded-md shadow-2xl font-extrabold sm:h-10 xl:text-2xl xl:h-11 "
          >
            Room {room} ({getCount(countOfUsers, room)})
          </button>
        );
      })}
    </div>
  );
}
