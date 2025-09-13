
import { useContext, useEffect, useState, useMemo, JSX} from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { SocketContext } from "./App";
import { GameState, Player , Phase, Loot, LootType} from "../../shared";
import "./App.css";
// const {state} = useLocation()


// const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3000/")

// socket.on("connect", () => {
//   console.log(`Client ${socket.id}`)
// })

{/* <svg width="200" height="200">
  <image
    href="myImage.png"
    x="50"
    y="50"
    width="100"
    height="100"
    transform="rotate(45, 100, 100)" 
  />
</svg> */}


const centerTextY = 20
const gunImage = "../public/images/pistol.svg";
const gunImageLeft = "../public/images/pistolLeft.svg"


function flipped(index1: number, index2: number) : boolean {
  const angle = calculateAngle(index1,index2);
  if ((angle > 90) || (angle < -90)) {
    return true
  }
  return false
}

function getX(id: number) : number {
    let x: number=0;
    if (id == 5 || id == 7) {
      x = 0
    }
    else if (id == 3 || id == 0) {
      x = 30
    }
    else if (id == 2 || id == 1) {
      x = 60
    }
    else if (id == 6 || id == 4) {
      x = 90
    }
    // add logic to position the player
    return x
  }

  function getY(id: number) : number {
    let y: number=0;
    if (id == 0 || id == 2) {
      y = 8
    }
    else if (id == 4 || id == 7) {
      y = 15
    }
    else if (id == 5 || id == 6) {
      y = 35
    }
    else if (id == 3 || id == 1) {
      y = 42
    }
    // add logic to position the player
    return y
  }

  function getInnerY(id: number): number {
    let y = getY(id)-1.5;
    if (id == 5 || id == 6) {
      y += 8
    }
    else if (id == 4 || id == 7) {
      y -= 8
    }
    else if (id == 0 || id == 2) {
      y -= 2
    }
    else if (id == 1 || id == 3) {
      y += 3
    }
    return y
  }
  function getInnerX(id: number): number {
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


function calculateAngle(index1: number,index2:number): number {
  console.log(index1)
  console.log(index2)
  const xdiff = getX(index2)-getX(index1);
  const ydiff = getY(index2)-getY(index1);
  let angle = Math.atan(ydiff/xdiff);
  // if (xdiff < 0) {
  //   angle*=-1
  // }
  // console.log(xdiff)
  // console.log(ydiff)
  let outAngle = 180/Math.PI*angle;
  if (xdiff < 0) {
    outAngle += 180;
  }
  console.log(outAngle)
  return outAngle
}

// console.log(calculateAngle(1,2,3,4))

function Game() {
  const socket = useContext(SocketContext);
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
  // const [circleStrokeColor,setCircleStrokeColor] = useState("black");
  const [targetArray,setTargetArray] = useState<number[]>([]);
  const [ammo,setAmmo] = useState(-1)
  const [hoverIndex,setHoverIndex] = useState(-1);
  const [hoverBullet,setHoverBullet] = useState(Boolean);
  const [hoverBlank,setHoverBlank] = useState(Boolean);
  const [lootTurn,setLootTurn] = useState(false);
  const [godfatherIndex,setGodfatherIndex] = useState<number>(0);
  const [skipHover,setSkipHover] = useState<boolean>(false);
  const [round,setRound] = useState<number>(0);

  const {state} = useLocation()
  const room = state.room;
  const thisId = state.id;
  // before i get to the end, need to change the above so it is dependent on the localStorage instead
  const [thisPlayer,setThisPlayer] = useState<Player>(new Player("",""))


  
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
  // console.log(playerHealth)

  // function changeInit(playerArrayIn: Player[]): void {
  //   const names = playerArrayIn.map(player => player.name);
  //   const health = playerArrayIn.map(player => player.health);
  //   setPlayerNames(names);
  //   setPlayerHealth(health);
  //   const targets = playerArrayIn.map(player => player.target);
  //   setTargetArray(targets);


  //   // setPlayerButtons(true);
  //   // console.log("This happened")
  //   // console.log(names)
  // }

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
    console.log("SKIPPEd")
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
  
  // console.log(lootDict)

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

    // useEffect(() => {
    //   // socket.on()
    // })
    
    // console.log(thisPlayer)
    // console.log(targetArray)
    // console.log(completedPhase);

    // useEffect(() => {
    //   const handleSendGodfatherIndex = (index: number) => {
    //     setGodfatherIndex(index);
    //   }
    //   socket.on("sendGodfatherIndex",handleSendGodfatherIndex);

    //   return () => {
    //       socket.off("sendGodfatherIndex", handleSendGodfatherIndex);
    //   }
    // })

    // useEffect(() => {
    //   const handleSendLootTurnPlayer = (index: number) => {
    //     if (thisId == index) {
    //       setLootTurn(true);
    //     }
    //     else {
    //       setLootTurn(false);
    //     }
    //   }

    //   socket.on("sendLootPlayerTurn",handleSendLootTurnPlayer);

    //   return () => {
    //     socket.off("sendLootPlayerTurn", handleSendLootTurnPlayer);
    //   }
    // })

    // useEffect(() => {
    //     const handleSendLootDict = (lootDictIn: Record<number,Loot>) => {
    //       // console.log(lootDictIn);
    //       setLootDict(lootDictIn);
    //     }

    //     socket.on("sendLootDict",handleSendLootDict);

    //     return () => {
    //       socket.off("sendLootDict",handleSendLootDict);
    //     }
    // })

    // console.log(completedPhase)
    // console.log(targetArray)
    // useEffect(() => {
    //     // socket.emit("requestPlayersAndPhase", room,["INIT"])

    //     // const handleSendNames = (playerArrayIn: Player[]) 

    //     const handleSendPlayersAndPhase = (playerArrayIn: Player[], phaseIn: Phase, changes: string[]) => {
    //       // console.log(phaseIn)
    //       setPhase(phaseIn);
    //       setThisPlayer(playerArrayIn[thisId]);
    //       setCompletedPhase(playerArrayIn[thisId].completedPhase);
    //       for (const change of changes) {
    //           if (change == "INIT") {
    //             changeInit(playerArrayIn);
    //             // console.log("THis")
    //             // setPlayerArray(playerArrayIn);
    //             // setPhase(phaseIn);
    //           }
    //           // if (change == "INIT")
    //           else if (change == "target") {
    //             const targets = playerArrayIn.map(player => player.target);
    //             setTargetArray(targets);
    //           }
    //           else if (change == "health") {
    //             const health = playerArrayIn.map(player => player.health);
    //             setPlayerHealth(health);
    //           }
    //           else if (change == "hiding") {
    //             const hiding = playerArrayIn.map(player => player.hiding);
    //             setHidingArray(hiding);
    //           }
    //           else if (change == "damaged") {
    //             const damaged = playerArrayIn.map(player => (player.pendingHits > 0) ? true : false)
    //             setDamagedArray(damaged);
    //           }
    //         }
    //         // setLength(playerArrayIn.length);
    //     }

    //     const handleSendLootDict = (lootDictIn: Record<number,Loot>) => {
    //       // console.log(lootDictIn);
    //       setLootDict(lootDictIn);
    //     }



    //     socket.on("sendPlayersAndPhase", handleSendPlayersAndPhase);
    //     socket.on("sendLootDict",handleSendLootDict);

    //     return () => {
    //         socket.off("sendPlayersAndPhase", handleSendPlayersAndPhase);
    //         socket.off("sendLootDict",handleSendLootDict);
    //     }
    // })
    // const bulletSVGs: React.ReactNode[] = [];
    // for (let i = 0; i < thisPlayer.bullets; i++) {

    // }
    const guns = useMemo(() => {
      return targetArray.map((target:number,index:number) => (
        <g key={index}>
          {flipped(index, target) ? 
          (<image href={gunImageLeft} height="4" width="4" x={getX(index)-5} y={getY(index)} transform={`rotate(${180+calculateAngle(index,target)}, ${getX(index)+5}, ${getY(index)})`} />) :
          (<image href={gunImage} height="4" width="4" x={getX(index)+10} y={getY(index)} transform={`rotate(${calculateAngle(index,target)}, ${getX(index)+5}, ${getY(index)})`} />)
          }
          <line key={index} x1={(getX(index)== getX(target)) ? (getX(index)+5) : ((getX(index)+5) + (getX(target)-getX(index))*5/(Math.abs(getX(target)-getX(index))))} x2={getX(target)+5} y1={(getY(index) == getY(target)) ? getY(index) : (getY(index) + (getY(target)-getY(index))*5/(Math.abs(getY(target)-getY(index))))} y2={getY(target)} stroke="black" strokeWidth="0.2"></line>
      </g>))},[targetArray]);



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

      const handleSocketDisconnect = (reason: string ) => {
        socket.emit("socketDisconnected",thisId,room)
      }
      socket.on("getPlayerNames",handleGetNames)
      socket.on("getGameState",handleGetGameState);
      socket.on("disconnect",handleSocketDisconnect);

      return () => {
        socket.off("getPlayerNames",handleGetNames)
        socket.off("getGameState",handleGetGameState);
      }
    },[])

  return <svg id="main" x = "0px" y="0px" xmlns = "http://www.w3.org/2000/svg" viewBox="0 0 100 50">
      <g>
          <text className="text" x="0" y="2" fontSize="3">Round {round+1}</text>
          {playerNames.map((name: string, index: number) => 
          <g key={index} onClick={((playerButtons) && (index!== thisId) && !((phase=="GODFATHERPRIV") && (thisId !== godfatherIndex) && (index === targetArray[thisId]))) ? (
            () => {
              playerClicked(index);
              setPlayerButtons(false);
              setHoverIndex(-1);
            }
          ): doNothing} onMouseEnter={((playerButtons) && (index!== thisId)  && !((phase=="GODFATHERPRIV") && (thisId !== godfatherIndex) && (index === targetArray[thisId]))) ? (
            () => setHoverIndex(index)
          ): doNothing} onMouseLeave={((playerButtons) && (index!== thisId)) ? (
            () => setHoverIndex(-1)
          ): doNothing}>
            <circle cx={getX(index)+5} cy={getY(index)} r="5" fill={((playerButtons) && (index!== thisId) && !((phase=="GODFATHERPRIV") && (thisId !== godfatherIndex) && (index === targetArray[thisId]))) ? "yellow" : "none"} stroke="none"></circle>
            <image href="../public/images/character.svg" height={hoverIndex==index ? "14":"13"} width={hoverIndex==index ? "14":"13"} x={hoverIndex==index ? (getX(index)-2):(getX(index)-1.5)} y={hoverIndex==index ? (getY(index)-7):(getY(index)-6.5)}></image>
            <text className="text" x={getX(index)+5-(name.length)/2} y={getY(index)+5.5} fontSize="2">{name}</text>
            {(index === thisId) ? (
              <g>
              <rect x={getInnerX(index)} y={getInnerY(index)-1} width="10" height="5" fill="white" stroke="black" strokeWidth="0.1"></rect>
              <text className="text" x={getInnerX(index)+0.1} y={getInnerY(index)+0.75} fontSize="2">${thisPlayer.money}</text>
              <image href={getImage(LootType.gem)} x={getInnerX(index)+2} y={getInnerY(index)+2} height="2" width="2" />
              <text className="text" x={getInnerX(index)+1} y={getInnerY(index)+3.5} fontSize="2">{thisPlayer.gems}</text>
              <image href={getImage(LootType.nft)} x={getInnerX(index)+8} y={getInnerY(index)+1.75} height="2" width="2" />
              <text className="text" x={getInnerX(index)+7} y={getInnerY(index)+3.5} fontSize="2">{thisPlayer.nft}</text>
              {Array.from({length: thisPlayer.bullets}).map((_, i: number) => (
                <image key={i} href={getImage(LootType.clip)} x={getInnerX(index)+8-i} y={getInnerY(index)-0.9} height="2" width="2"/>
              ))}
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
                    <text className="text" x="38" y={centerTextY} fontSize="3">Choose a target</text>
                  ): null}
                  {((bulletChoice) && (!completedPhase)) ? (
                    <>
                    <text className="text" x="30" y={centerTextY} fontSize="3">Choose what to load in your gun this round</text>
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
                    {guns}
                    {((thisId === godfatherIndex) && (playerButtons)) ? (
                      <g onClick={skipGodFatherPriv} onMouseEnter={() => {setSkipHover(true)}} onMouseLeave={() => {setSkipHover(false)}}>
                        <rect x="48" y="25" height="2" width="6" fill="white" stroke="black" strokeWidth={skipHover ? "0.3" : "0.1"} onClick={skipGodFatherPriv}>Skip</rect>
                        <text className="text" x="49" y="26.5" fontSize="2">Skip</text>
                      </g>
                    ): null}
                  </g>;
              case "GAMBLING":
                return <g>
                    {guns}
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
