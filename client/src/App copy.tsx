import {FormEvent, useEffect, useState} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PreLobby from "./PreLobby";
// import Game from "./Game";
import { Socket, io } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../../typings";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3000/")

socket.on("connect", () => {
  console.log(`Client ${socket.id}`)
})

// const moveBtn : HTMLElement = document.getElementById("moveBtn")!;
// moveBtn.addEventListener("click", () => {
//   socket.emit("buttonClick")
// })
// socket.on("handleButton",() => {
//   console.log("BUTTON PRESSEDDDDD")
// })

// socket.on("getPhase",(phase: number) => {
//   //gets phase val from the server and assigns it
// })

// socket.on("getRound",(round: number) => {
//   //get round number from the server and assigns it
// })

// // socket.emit("bulletChoice",choice, id)
// //socket.emit("godFatherPriv",choice)
// //socket.emit("gamblingChoice",choice,id)
// //socket.emit("lootChoice",choice,id)


// //NEED HANDLER HERE TO HANDLE ROUND AND PHASE AND PERFORM CORRECT FUNCTION
// // NEED TO CHANGE ALL NAMES OF EVERYTHING, ENTIRE THEME
// function handleActions(phase: number) {
//   // Action for each thing possible
//   // distributeLoot() // this is an intermediate step (not actually part of sockets)
//   // chooseBullet() // choose blank or bullet
//   // godFatherPriv() // choose to redirect (need to change)
//   // gambling() // hide or do not hide
//   // fireShots() // shots fired depending on what occurs
//   // loot() // gain loot for alive players
// }

function App() {
  const [room, setRoom] = useState("")
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    // socket.emit("clientMsg",{msg,room});

    setMsg("");
    setRoom("");
  };

  const joinRoom = (e:FormEvent) => {
    e.preventDefault();
    socket.emit("joinRoom",room);
    setRoom("");
  }

  useEffect(() => {
    socket.on("enterExistingRoom",() => {

    })
  })

  useEffect(() => {
    socket.on("serverMsg", (data) => {
      setMessages([...messages, data.msg]);
    })
  }, [socket,messages]);
  console.log(messages);
  return <div>
      <form onSubmit={joinRoom}>
        <input type="text" placeholder="Room number" value={room} onChange={(e) => setRoom(e.target.value.toUpperCase())}/>
        <button name="joinRoom">Join Room</button>
      </form>
      {/* <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter room key" value={room} onChange={(e) => setRoom(e.target.value)}/>
        <input type="text" placeholder="Enter message" value={msg} onChange={(e) => setMsg(e.target.value)}/>
        <button>Send Message</button>
      </form> */}
    </div>
  
}

export default App
