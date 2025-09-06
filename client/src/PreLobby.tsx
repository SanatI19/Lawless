// import {FormEvent, useEffect, useState} from "react";
// import { Socket, io } from "socket.io-client";
// import { ServerToClientEvents, ClientToServerEvents } from "../../typings";
// import {useSocket} from "./useSocket"

// const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3000/")

// socket.on("connect", () => {
//   console.log(`Client ${socket.id}`)
// })
// import {useSocket} from "./useSocket";
import { useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "./App";



function PreLobby() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [room, setRoom] = useState("");
  const [err, setErr] = useState("");



  const joinRoom = () => {
    socket.emit("joinRoom",room);
    setRoom("");
  }

  const createRoom = () => {
    socket.emit("createRoom")
  }
  useEffect(() => {
    const handleEnterExistingRoom = (roomId:string) => {
        console.log(roomId)
        if (roomId == "") {
            setErr("Room does not exist")
        }
        else {
            navigate(`/${roomId}/pregame`,{state :{room: roomId}});
        }
    };

    const handleUnableToCreateRoom = () => {
        setErr("Unable to create room, server full.");
    };
    socket.on("enterExistingRoom",handleEnterExistingRoom)

    socket.on("unableToCreateRoom", handleUnableToCreateRoom);

    return () => {
      socket.off("enterExistingRoom",handleEnterExistingRoom);

      socket.off("unableToCreateRoom", handleUnableToCreateRoom);
    }
  })

//   useSocket("enterExistingRoom",(roomId) => {
//     console.log(roomId)
//     if (roomId == "") {
//         setErr("Room does not exist")
//     }
//     else {
//         navigate(`/game/${roomId}`);
//     }
//   })


  return <div>
      <h2>{err}</h2>
      <div>
        <input type="text" placeholder="Room number" value={room} onChange={(e) => setRoom(e.target.value.toUpperCase())}/>
        <button onClick={joinRoom}>Join Room</button>
      </div>
      <div>
        <button onClick={createRoom}>Create Room</button>
      </div>
      {/* <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter room key" value={room} onChange={(e) => setRoom(e.target.value)}/>
        <input type="text" placeholder="Enter message" value={msg} onChange={(e) => setMsg(e.target.value)}/>
        <button>Send Message</button>
      </form> */}
    </div>
  
}

export default PreLobby
