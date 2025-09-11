
import { useContext, useEffect, useState} from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { SocketContext } from "./App";
import { GameState, Player , Phase, Loot, LootType} from "../../shared";
import "./App.css";
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
  const [phase,setPhase] = useState<Phase>(Phase.LoadAndAim)
  const [bulletChoice,setBulletChoice] = useState(false);
  const [playerButtons,setPlayerButtons] = useState(Boolean);
  const [completedPhase,setCompletedPhase] = useState(false);
  // const [hiding, setHiding] = useState(false);
  const [hidingArray, setHidingArray] = useState<boolean[]>([false])
  const [damagedArray, setDamagedArray] = useState<boolean[]>([false])
  const [lootDict,setLootDict] = useState<Record<number,Loot>>({});
  const [circleStrokeColor,setCircleStrokeColor] = useState("black");
  const [targetArray,setTargetArray] = useState<number[]>([]);
  const [ammo,setAmmo] = useState(-1)
  const [hoverIndex,setHoverIndex] = useState(-1);
  const [hoverBullet,setHoverBullet] = useState(Boolean);
  const [hoverBlank,setHoverBlank] = useState(Boolean);
  const [lootTurn,setLootTurn] = useState(false);
  const [godfatherIndex,setGodfatherIndex] = useState<number>(0);
  const [skipHover,setSkipHover] = useState<boolean>(false);
  const [round,setRound] = useState<number>(0);
  // const [thisChoosingLoot]
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
      x = 15
    }
    else if (id == 3 || id == 0) {
      x = 35
    }
    else if (id == 2 || id == 1) {
      x = 55
    }
    else if (id == 6 || id == 4) {
      x = 75
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
    let y = getY(id)-1.5;
    // if (id == 0 || id == 2) {
    //   y = 10.5
    // }
    // else if (id == 4 || id == 7) {
    //   y = 20
    // }
    // else if (id == 5 || id == 6) {
    //   y = 30
    // }
    // else if (id == 3 || id == 1) {
    //   y = 36.5
    // }

    if (id == 5 || id == 6) {
      y -= 5
    }
    else if (id == 4 || id == 7) {
      y += 5
    }
    return y
  }
  function getInnerX(id: number): number {
    // let x: number=0;
    // if (id == 5 || id == 7) {
    //   x = 20
    // }
    // else if (id == 3 || id == 0) {
    //   x = 35
    // }
    // else if (id == 2 || id == 1) {
    //   x = 55
    // }
    // else if (id == 6 || id == 4) {
    //   x = 60
    // }
    let x = getX(id);

    if (id == 0 || id == 3) {
      x -= 10.5
    }
    else if (id == 1 || id == 2) {
      x += 10.5
    }
    return x
  }

  function getLootX(id: number) : number {
    let x = 0;
    if (id == 0) {
      x = 45
    }
    if (id == 1 || id == 5) {
      x = 30
    }
    else if (id == 2 || id == 6) {
      x = 40
    }
    else if (id == 3 || id == 7) {
      x = 50
    }
    else if (id == 4 || id == 8) {
      x = 60
    }
    return x;
  }
  function getLootY(id: number) : number {
    let y = 30;
    if (id == 0) {
      y = 14
    }
    else if (id <=4) {
      y = 22
    }
    return y;
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
      color = "red"
    }

    return color
  }
  // console.log(thisPlayer.bullets)
  console.log(playerHealth)

  function changeInit(playerArrayIn: Player[]): void {
    const names = playerArrayIn.map(player => player.name);
    const health = playerArrayIn.map(player => player.health);
    setPlayerNames(names);
    // setThisPlayer(playerArrayIn[thisId]);
    // setPhase(phaseIn);
    setPlayerHealth(health);
    const targets = playerArrayIn.map(player => player.target);
    setTargetArray(targets);
    // setAmmo(thisPlayer.bulletChoice)

    // setPlayerButtons(true);
    // console.log("This happened")
    // console.log(names)
  }

  function itemTaken(index: number): void {
    socket.emit("addItemToPlayer", index, thisId,room);
    console.log("item got taken")
  }


  function playerClicked(index: number): void {
    // console.log()
    // const index = targetIndex;
    console.log(index+ " got clicked")
    if (phase == Phase.LoadAndAim) {
      setCompletedPhase(true);
      socket.emit("sendBulletAndTarget",ammo,index,thisId,room);
    }
    else if (phase == Phase.GodfatherPriv) {
      if (thisId == godfatherIndex) {
        console.log("godfather decision sent")
        socket.emit("sendGodfatherDecision",thisId,index,room);
      }
      else {
        socket.emit("sendBulletAndTarget",ammo,index,thisId,room);
      }
    }
  }

  function skipGodFatherPriv() {
    socket.emit("continueToGambling",room);
  }
  // const playerClickedHandlers = playerNames.map((_,index : number) => () => playerClicked(index))

  function hidingChosen(choice : boolean) : void {
    setCompletedPhase(true)
    socket.emit("sendHidingChoice",thisId,choice,room);
  }

  function getImage(type: LootType): string {
    let src = "";
    if (type == LootType.cash) {
      src = "../public/images/money.svg";
    }
    else if (type == LootType.clip) {
      src = "../public/images/bullet.svg";
    }
    else if (type == LootType.gem) {
      src = "../public/images/gem.svg";
    }
    else if (type == LootType.godfather) {
      src = "../public/images/chief.svg";
    }
    else if (type == LootType.medKit) {
      src = "../public/images/heart.svg";
    }
    else if (type == LootType.nft) {
      src = "../public/images/nft.svg";
    }
    return src
  }
  // console.log(thisPlayer.bullets)

  const doNothing = () => {

  }
  
  console.log(lootDict)

//   setRoom(state.room)

//   const handleSubmit = (e:FormEvent) => {
//     e.preventDefault();
    useEffect(() => {
      socket.emit("requestInitialState", room)
      // console.log("THIS OCCURRED")
    },[room])

    useEffect(() => {
      switch (phase) {
        case "LOADANDAIM" : 
          setBulletChoice(true);
          break;
        case "GODFATHERPRIV" :
          if (!completedPhase) {
            // setCompletedPhase(true);
            setPlayerButtons(true);
          }
          else {
            setPlayerButtons(false)
          }
          break;
    }},[phase,completedPhase])
    
    console.log(thisPlayer)
    console.log(targetArray)
    console.log(completedPhase);

    useEffect(() => {
      const handleSendGodfatherIndex = (index: number) => {
        setGodfatherIndex(index);
      }
      socket.on("sendGodfatherIndex",handleSendGodfatherIndex);

      return () => {
          socket.off("sendGodfatherIndex", handleSendGodfatherIndex);
      }
    })

    useEffect(() => {
      const handleSendLootTurnPlayer = (index: number) => {
        if (thisId == index) {
          setLootTurn(true);
        }
        else {
          setLootTurn(false);
        }
      }

      socket.on("sendLootPlayerTurn",handleSendLootTurnPlayer);

      return () => {
        socket.off("sendLootPlayerTurn", handleSendLootTurnPlayer);
      }
    })

    useEffect(() => {
        const handleSendLootDict = (lootDictIn: Record<number,Loot>) => {
          // console.log(lootDictIn);
          setLootDict(lootDictIn);
        }

        socket.on("sendLootDict",handleSendLootDict);

        return () => {
          socket.off("sendLootDict",handleSendLootDict);
        }
    })

    // console.log(completedPhase)
    // console.log(targetArray)
    useEffect(() => {
        // socket.emit("requestPlayersAndPhase", room,["INIT"])

        // const handleSendNames = (playerArrayIn: Player[]) 

        const handleSendPlayersAndPhase = (playerArrayIn: Player[], phaseIn: Phase, changes: string[]) => {
          // console.log(phaseIn)
          setPhase(phaseIn);
          setThisPlayer(playerArrayIn[thisId]);
          setCompletedPhase(playerArrayIn[thisId].completedPhase);
          for (const change of changes) {
              if (change == "INIT") {
                changeInit(playerArrayIn);
                // console.log("THis")
                // setPlayerArray(playerArrayIn);
                // setPhase(phaseIn);
              }
              // if (change == "INIT")
              else if (change == "target") {
                const targets = playerArrayIn.map(player => player.target);
                setTargetArray(targets);
              }
              else if (change == "health") {
                const health = playerArrayIn.map(player => player.health);
                setPlayerHealth(health);
              }
              else if (change == "hiding") {
                const hiding = playerArrayIn.map(player => player.hiding);
                setHidingArray(hiding);
              }
              else if (change == "damaged") {
                const damaged = playerArrayIn.map(player => (player.pendingHits > 0) ? true : false)
                setDamagedArray(damaged);
              }
            }
            // setLength(playerArrayIn.length);
        }

        const handleSendLootDict = (lootDictIn: Record<number,Loot>) => {
          // console.log(lootDictIn);
          setLootDict(lootDictIn);
        }

        socket.on("sendPlayersAndPhase", handleSendPlayersAndPhase);
        socket.on("sendLootDict",handleSendLootDict);

        return () => {
            socket.off("sendPlayersAndPhase", handleSendPlayersAndPhase);
            socket.off("sendLootDict",handleSendLootDict);
        }
    })


    useEffect(() => {
      const handleGetNames = (playerArray: Player[]) => {
        setPlayerNames(playerArray.map(player => player.name));
      }

      const handleGetGameState = (gameState: GameState)  => {
        setGodfatherIndex(gameState.bossId);
        setLootDict(gameState.lootDict);
        setLootTurn(gameState.lootTurnPlayerIndex === thisId);
        setRound(gameState.round);
        const playerArray = gameState.playerArray;
        const thisPlayer = playerArray[thisId];
        setPlayerHealth(playerArray.map(player => player.health));
        setThisPlayer(thisPlayer);
        setAmmo(thisPlayer.bulletChoice);
        setCompletedPhase(thisPlayer.completedPhase);
        setHidingArray(playerArray.map(player => player.hiding));
        setDamagedArray(playerArray.map(player => player.pendingHits > 0))
        setTargetArray(playerArray.map(player => player.target));

        setPhase(gameState.phase);
      }

      socket.on("getPlayerNames",handleGetNames)
      socket.on("getGameState",handleGetGameState);

      return () => {
        socket.off("getPlayerNames",handleGetNames)
        socket.off("getGameState",handleGetGameState);
      }
    },[])

  return <svg id="main" x = "20px" y="20px" xmlns = "http://www.w3.org/2000/svg" viewBox="0 0 100 50">
      <g>
          <text x="0" y="2" fontSize="3">Round {round+1}</text>
          {playerNames.map((name: string, index: number) => 
          <g key={index} onClick={((playerButtons) && (index!== thisId) && !((thisId !== godfatherIndex) && (index === targetArray[thisId]))) ? (
            () => {
              playerClicked(index);
              setPlayerButtons(false);
              setHoverIndex(-1);
            }
          ): doNothing} onMouseEnter={((playerButtons) && (index!== thisId)  && !((thisId !== godfatherIndex) && (index === targetArray[thisId]))) ? (
            () => setHoverIndex(index)
          ): doNothing} onMouseLeave={((playerButtons) && (index!== thisId)) ? (
            () => setHoverIndex(-1)
          ): doNothing}>
            <circle cx={getX(index)+5} cy={getY(index)} r="5" fill={getColor(playerHealth[index])} stroke={(hoverIndex === index) ? "yellow": "black"} strokeWidth={(hoverIndex === index) ? "0.3":"0.1"}></circle>
            <text className="text" x={getX(index)+2.5} y={getY(index)} fontSize="2">{name}</text>
            {(index === thisId) ? (
              <g>
              <rect x={getInnerX(index)} y={getInnerY(index)} width="10" height="3" fill="white" stroke="black" strokeWidth="0.1"></rect>
              <text className="text" x={getInnerX(index)+1} y={getInnerY(index)+0.75} fontSize="1">Money: {thisPlayer.money}</text>
              <text className="text" x={getInnerX(index)+1} y={getInnerY(index)+1.5} fontSize="1">Gems: {thisPlayer.gems}</text>
              <text className="text" x={getInnerX(index)+1} y={getInnerY(index)+2.25} fontSize="1">NFTs: {thisPlayer.nft}</text>
              </g>
            ) : null}
          </g>
          )}
        {(completedPhase) ? (
          <text className="text" x="40" y="24" fontSize="2">Waiting for other players...</text>
        ) : (null)}
      </g>
      <g>
          {(() => {
            switch (phase) {
              case "LOADANDAIM":
                return <g>
                  {((!bulletChoice) && (!completedPhase)) ? (
                    <text className="text" x="38" y="18" fontSize="3">Choose a target</text>
                  ): null}
                  {((bulletChoice) && (!completedPhase)) ? (
                    <>
                    <text className="text" x="30" y="18" fontSize="3">Choose what to load in your gun this round</text>
                    {thisPlayer.bullets > 0 && (
                      <g id="bullet" onClick={() => {
                        setBulletChoice(false);
                        setHoverBullet(false);
                        setPlayerButtons(true);
                        setAmmo(1)
                        
                      }} onMouseEnter={() => setHoverBullet(true)} 
                          onMouseLeave={() => setHoverBullet(false)}>
                        <rect x="40" y="20" width="5" height="10" fill="grey" stroke={hoverBullet ? ("yellow") : ("black")} strokeWidth={hoverBullet ? ("0.2") : ("0.1")}></rect>
                        <text className="text" x="41" y="25" fontSize="1">Bullet</text>
                      </g>)}
                      {thisPlayer.blanks > 0 && (
                      <g id="blank" onClick={() => {
                        setBulletChoice(false);
                        setHoverBlank(false);
                        setPlayerButtons(true);
                        setAmmo(0);
                      }} onMouseEnter={() => setHoverBlank(true)} 
                        onMouseLeave={() => setHoverBlank(false)}>
                        <rect x="60" y="20" width="5" height="10" fill="grey" stroke={hoverBlank ? ("yellow") : ("black")} strokeWidth={hoverBlank ? ("0.2") : ("0.1")}></rect>
                        <text className="text" x="61" y="25" fontSize="1">Blank</text>
                      </g>)}
                    </>) : null}
                    
                  </g>;
              case "GODFATHERPRIV":
                return <g>
                    {((thisId === godfatherIndex) && playerButtons) ? (
                      <text className="text" x="30" y="18" fontSize="3">Choose a player to change their target, or skip</text>
                    ): null}
                    {((thisId !== godfatherIndex) && playerButtons) ? (
                      <text className="text" x="30" y="18" fontSize="3">Choose a different player to target</text>
                    ): null}
                    {targetArray.map((target:number,index:number) => 
                      <line key={index} x1={getX(index)} x2={getX(index) + (getX(target)-getX(index))*0.2} y1={getY(index)} y2={getY(index) + (getY(target)-getY(index))*0.2} stroke="black" strokeWidth="0.75"></line>
                    )}
                    {((thisId === godfatherIndex) && (playerButtons)) ? (
                      <g onClick={skipGodFatherPriv} onMouseEnter={() => {setSkipHover(true)}} onMouseLeave={() => {setSkipHover(false)}}>
                        <rect x="48" y="25" height="2" width="6" fill="white" stroke="black" strokeWidth={skipHover ? "0.3" : "0.1"} onClick={skipGodFatherPriv}>Skip</rect>
                        <text className="text" x="49" y="26.5" fontSize="2">Skip</text>
                      </g>
                    ): null}
                  </g>;
              case "GAMBLING":
                return <g>
                    {targetArray.map((target:number,index:number) => 
                      <line key={index} x1={getX(index)} x2={getX(index) + (getX(target)-getX(index))*0.2} y1={getY(index)} y2={getY(index) + (getY(target)-getY(index))*0.2} stroke="black" strokeWidth="0.75"></line>
                    )}
                    {(!completedPhase) ? (
                      <g id="choices">
                      <g id="stay" onClick={() => {
                        hidingChosen(false);
                        setHoverBullet(false);
                        
                      }} onMouseEnter={() => setHoverBullet(true)} 
                          onMouseLeave={() => setHoverBullet(false)}>
                        <rect x="40" y="20" width="5" height="10" fill="grey" stroke={hoverBullet ? ("yellow") : ("black")} strokeWidth={hoverBullet ? ("0.2") : ("0.1")}></rect>
                        <text className="text" x="41" y="25" fontSize="1">Stay</text>
                      </g>
                      <g id="hide" onClick={() => {
                        hidingChosen(true);
                        setHoverBlank(false);
                      }} onMouseEnter={() => setHoverBlank(true)} 
                        onMouseLeave={() => setHoverBlank(false)}>
                        <rect x="60" y="20" width="5" height="10" fill="grey" stroke={hoverBlank ? ("yellow") : ("black")} strokeWidth={hoverBlank ? ("0.2") : ("0.1")}></rect>
                        <text className="text" x="61" y="25" fontSize="1">Hide</text>
                      </g>
                      </g>) : null}
                  </g>;
              case "LOOTING": // need to add the animations and shiet for the shooting
                return <g>
                  {Object.values(lootDict).map((value: Loot, index: number) => 
                    value.type !== LootType.empty ? (
                      <g key={index} onClick={lootTurn ? (() => {
                        itemTaken(index);
                        setLootTurn(false);
                        }) : doNothing} stroke={lootTurn ? ("green") : "none"} strokeWidth="0.1">
                        <image href={getImage(value.type)} height="7" width="7" x={getLootX(index)} y={getLootY(index)}/>
                        <text className="text" x={getLootX(index)+0.5} y={getLootY(index)+2} fontSize="2">{value.value > 0 ? ("$"+value.value) : ""}</text>
                      </g>) : null
                  )}
                  
                </g>;
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
