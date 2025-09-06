
import { useContext, useEffect, useState} from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { SocketContext } from "./App";
import { Player } from "../../shared";
// const {state} = useLocation()


// const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3000/")

// socket.on("connect", () => {
//   console.log(`Client ${socket.id}`)
// })

let count = 0;
let thisId: number;

function PreGame() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
//   const [room, setRoom] = useState("")
//   const [messages, setMessages] = useState<string[]>([]);
  const [playerArray, setPlayerArray] = useState<Player[]>([]);
  const [length,setLength] = useState(Number);
  const {state} = useLocation()
  const room = state.room;

  const sendName = (name: string, id: number)  => {
    socket.emit("sendName",name,id,room);
  }
  
  const triggerStartGame = () => {
    socket.emit("triggerStartGame",room)
  }
//   setRoom(state.room)

//   const handleSubmit = (e:FormEvent) => {
//     e.preventDefault();
    useEffect(() => {
        socket.emit("requestPlayerArray", room)

        const handleSendPlayerArray = (playerArrayIn: Player[]) => {
            if (count == 0) {
                count++;
                thisId = playerArrayIn.length-1;
            }
            setPlayerArray(playerArrayIn);
            setLength(playerArrayIn.length);
        }

        const handleStartGame = () => {
          navigate(`/${room}/game`,{state :{room: room, id: thisId}})
        }

        socket.on("sendPlayerArray", handleSendPlayerArray);

        socket.on("startGame", handleStartGame);

        return () => {
          socket.off("sendPlayerArray", handleSendPlayerArray);
          socket.off("startGame", handleStartGame);
        };

    })

  return <div>
      <h1>Room {room}</h1>
      <div>
        {playerArray.map((player: Player, id: number) =>
            id === thisId ? ( 
          <input key={id} type="text" placeholder="Player name" value={player.name} onChange={(e) => sendName(e.target.value,thisId)}/>  
        ) : (
            <p key={id}>{player.name}</p>
        )
        )}
      </div>
      <br/>
      {thisId === 0 ? (<button disabled={length < 3} onClick={triggerStartGame}>Start Game</button>) : null}
      {/* <div>
        <input type="text" placeholder="Room number" value={room} onChange={(e) => setRoom(e.target.value.toUpperCase())}/>
        <button onClick={joinRoom}>Join Room</button>
      </div>
      <div>
        <button onClick={createRoom}>Create Room</button>
      </div> */}
      {/* <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter room key" value={room} onChange={(e) => setRoom(e.target.value)}/>
        <input type="text" placeholder="Enter message" value={msg} onChange={(e) => setMsg(e.target.value)}/>
        <button>Send Message</button>
      </form> */}
    </div>
  
}

export default PreGame
