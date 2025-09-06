
import { useContext, useEffect, useState} from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { SocketContext } from "./App";
import { Player , Phase} from "../../shared";
// const {state} = useLocation()


// const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3000/")

// socket.on("connect", () => {
//   console.log(`Client ${socket.id}`)
// })

let count = 0;

function Game() {
  const socket = useContext(SocketContext);
//   const navigate = useNavigate();
//   const [room, setRoom] = useState("")
//   const [messages, setMessages] = useState<string[]>([]);
  // const [playerArray, setPlayerArray] = useState<Player[]>([]);
  const [playerNames,setPlayerNames] = useState<string[]>([""]);
  const [playerHealth,setPlayerHealth] = useState<number[]>([]);
  const [phase,setPhase] = useState<Phase>(Phase.Reset)
  const [playerButtons,setPlayerButtons] = useState(Boolean);
  const [circleStrokeColor,setCircleStrokeColor] = useState("black");
  const [hoverIndex,setHoverIndex] = useState(-1);
  // const [targetIndex,setTargetIndex] = useState(-1);
  const {state} = useLocation()
  const room = state.room;
  const thisId = state.id;
  const [thisPlayer,setThisPlayer] = useState<Player>(new Player("player"))


  const sendName = (name: string, id: number)  => {
    socket.emit("sendName",name,id,room);
  }

  function getX(id: number) : number {
    let x: number=0;
    if (id == 5 || id == 7) {
      x = 10
    }
    else if (id == 3 || id == 0) {
      x = 30
    }
    else if (id == 2 || id == 1) {
      x = 50
    }
    else if (id == 6 || id == 4) {
      x = 70
    }
    // add logic to position the player
    return x
  }

  function getY(id: number) : number {
    let y: number=0;
    if (id == 0 || id == 2) {
      y = 5
    }
    else if (id == 4 || id == 7) {
      y = 20
    }
    else if (id == 5 || id == 6) {
      y = 30
    }
    else if (id == 3 || id == 1) {
      y = 45
    }
    // add logic to position the player
    return y
  }

  function getInnerY(id: number): number {
    let y = 0;
    if (id == 0 || id == 2) {
      y = 10.5
    }
    else if (id == 4 || id == 7) {
      y = 20
    }
    else if (id == 5 || id == 6) {
      y = 30
    }
    else if (id == 3 || id == 1) {
      y = 36.5
    }
    return y
  }
  function getInnerX(id: number): number {
    let x: number=0;
    if (id == 5 || id == 7) {
      x = 20
    }
    else if (id == 3 || id == 0) {
      x = 30
    }
    else if (id == 2 || id == 1) {
      x = 50
    }
    else if (id == 6 || id == 4) {
      x = 60
    }
    return x
  }

  function getColor(health: number) : string {
    let color = "black"
    if (health == 3) {
      color = "green"
    }
    else if (health == 2) {
      color = "yellow"
    }
    else if (health == 1) {
      color == "red"
    }

    return color
  }

  function changeInit(playerArrayIn: Player[],phaseIn: Phase): void {
    const names = playerArrayIn.map(player => player.name);
    const health = playerArrayIn.map(player => player.health);
    setPlayerNames(names);
    setThisPlayer(playerArrayIn[thisId]);
    setPhase(phaseIn);
    setPlayerHealth(health);
    setPlayerButtons(true);
    // console.log("This happened")
    // console.log(names)
  }

  function playerClicked(index: number): void {
    // console.log()
    // const index = targetIndex;
    console.log(index+ " got clicked")
  }
  

  const doNothing = () => {

  }


  
  

//   setRoom(state.room)

//   const handleSubmit = (e:FormEvent) => {
//     e.preventDefault();
    useEffect(() => {
      socket.emit("requestPlayersAndPhase", room,["INIT"])
      console.log("THIS OCCURRED")
    },[room])

    useEffect(() => {
        // socket.emit("requestPlayersAndPhase", room,["INIT"])

        const handleSendPlayersAndPhase = (playerArrayIn: Player[], phaseIn: Phase, changes: string[]) => {
            for (const change of changes) {
              if (change == "INIT") {
                changeInit(playerArrayIn,phase);
                // console.log("THis")
                // setPlayerArray(playerArrayIn);
                // setPhase(phaseIn);
              }
            }
            // setLength(playerArrayIn.length);
        }
        socket.on("sendPlayersAndPhase", handleSendPlayersAndPhase);

        return () => {
            socket.off("sendPlayersAndPhase", handleSendPlayersAndPhase);
        }
    })

  return <svg id="main" x = "20px" y="20px" xmlns = "http://www.w3.org/2000/svg" viewBox="0 0 100 50">
      <g>
          {playerNames.map((name: string, index: number) => 
          <g key={index} onClick={((playerButtons) && (index!== thisId)) ? (
            () => {
              playerClicked(index);
            }
          ): doNothing} onMouseEnter={((playerButtons) && (index!== thisId)) ? (
            () => setHoverIndex(index)
          ): doNothing} onMouseLeave={((playerButtons) && (index!== thisId)) ? (
            () => setHoverIndex(-1)
          ): doNothing}>
            <circle cx={getX(index)+5} cy={getY(index)} r="5" fill={getColor(playerHealth[index])} stroke={(hoverIndex === index) ? "yellow": "black"} strokeWidth={(hoverIndex === index) ? "0.3":"0.1"}></circle>
            <text x={getX(index)+2.5} y={getY(index)} fontSize="2">{name}</text>
            {(index === thisId) ? (
              <g>
              <rect x={getInnerX(index)} y={getInnerY(index)} width="10" height="3" fill="white" stroke="black" strokeWidth="0.1"></rect>
              <text x={getInnerX(index)+1} y={getInnerY(index)+0.75} fontSize="1">Money: {thisPlayer.money}</text>
              <text x={getInnerX(index)+1} y={getInnerY(index)+1.5} fontSize="1">Gems: {thisPlayer.gems}</text>
              <text x={getInnerX(index)+1} y={getInnerY(index)+2.25} fontSize="1">NFTs: {thisPlayer.nft}</text>
              </g>
            ) : null}
          </g>
          )}
          {/* {playerHealth.map((health: number, index: number) => 

          )} */}
      </g>
      <g>
          {(() => {
            switch (phase) {
              case "RESET":
                return <text fill="green">Alive</text>;
              case "LOADANDAIM":
                return <text fill="red">Dead</text>;
              case "GODFATHERPRIV":
                return <text fill="red">Dead</text>;
              case "GAMBLING":
                return <text fill="red">Dead</text>;
              case "SHOOTING":
                return <text fill="red">Dead</text>;
              case "LOOTING":
                return <text fill="red">Dead</text>;
              case "ROUNDEND":
                return <text fill="red">Dead</text>;
            }
          })()}
      </g>
    </svg>
        {/* {playerArray.map((player: Player, id: number) =>
            id === thisId ? ( 
          <input key={id} type="text" placeholder="Player name" value={player.name} onChange={(e) => sendName(e.target.value,thisId)}/>  
        ) : (
            <p key={id}>{player.name}</p>
        )
        )}
      </div>
      </svg> */}
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
    // </div>
  
}

export default Game
