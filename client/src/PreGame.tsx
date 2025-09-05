import {FormEvent, useEffect, useState} from "react";
import { Socket, io } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../../typings";
import {useSocket} from "./useSocket"

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3000/")

// socket.on("connect", () => {
//   console.log(`Client ${socket.id}`)
// })



function PreGame() {
  const [room, setRoom] = useState("")
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    // socket.emit("clientMsg",{msg,room});

    setMsg("");
    setRoom("");
  };

  const joinRoom = () => {
    socket.emit("joinRoom",room);
    setRoom("");
  }

  const createRoom = () => {
    socket.emit("createRoom")
  }

//   useEffect(() => {
//     socket.on("enterExistingRoom",() => {
      
//     })
//   })
  useSocket("enterExistingRoom",() => {

  })

  useEffect(() => {
    socket.on("serverMsg", (data) => {
      setMessages([...messages, data.msg]);
    })
  }, [socket,messages]);
  console.log(messages);
  return <div>

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

export default PreGame
