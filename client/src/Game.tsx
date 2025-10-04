
import { useContext, useEffect, useState, useMemo, JSX} from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation} from "react-router-dom";
import { SocketContext } from "./App";
import { GameState, Player , Phase, Loot, LootType} from "../../shared";
import "./App.css";
// import { setDefaultAutoSelectFamilyAttemptTimeout } from "net";
// const {state} = useLocation()



// const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3000/")

// socket.on("connect", () => {
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


const centerTextY = 3
const gunImage = "../public/images/pistol.svg";
const gunImageLeft = "../public/images/pistolLeft.svg";
const bandageImage = "../public/images/bandage.svg";
const heartImage = "../public/images/heart.svg";
const blankImage = "../public/images/blank.svg";
const shieldImage = "../public/images/shield.svg";


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
      x = 8
    }
    else if (id == 3 || id == 0) {
      x = 35
    }
    else if (id == 2 || id == 1) {
      x = 55
    }
    else if (id == 6 || id == 4) {
      x = 82
    }
    // add logic to position the player
    return x
  }

  function getY(id: number) : number {
    let y: number=0;
    if (id == 0 || id == 2) {
      y = 12
    }
    else if (id == 4 || id == 7) {
      y = 20
    }
    else if (id == 5 || id == 6) {
      y = 35
    }
    else if (id == 3 || id == 1) {
      y = 43
    }
    // add logic to position the player
    return y
  }

  function getInnerY(id: number): number {
    let y = getY(id)-1.5;
    if (id == 5 || id == 6) {
      y += 9
    }
    else if (id == 4 || id == 7) {
      y -= 10
    }
    else if (id == 0 || id == 2) {
      // y -= 4
      y += 3
    }
    else if (id == 1 || id == 3) {
      y -= 4
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
    else if (id == 5 || id == 7) {
      x -= 6
    }
    else {
      x += 2
    }
    return x
  }

  function getContainerX(id: number ): number {
    let x = getInnerX(id)-1;
    if (id == 1 || id == 2) {
      x -= 8
    }
    // else if (id == 4 || id == 6) {
    //   x -=5
    // }
    // else if (id == )
    return x
  }

  function getContainerY(id: number) : number {
    let y = getInnerY(id)-2;
    if (id == 0 || id == 2) {
      y -= 7
    }
    if (id == 1 || id == 3) {
      // y -= 1
    }
    if (id == 5 || id == 6) {
      y -= 13
    }
    return y
  }

  function getWidth(index: number): number {
    let width = 20;
    if (index > 3) {
      width = 16;
    }
    return width
  }

  function getHeight(index: number): number {
    let height = 14;
    if (index > 3) {
      height = 20
    }
    return height
  }
 
  function getButtonLocationX(id : number) : number {
    let x = getInnerX(id);
    if (id == 5 || id == 7) {
    }
    else if (id == 4 || id == 6) {
      x +=10
    }
    return x
  }

  function getButtonLocationX2(id : number ) : number {
    let x = getButtonLocationX(id)
    if (id < 4) {
      x += 5
    }
    return x
  }

  function getButtonLocationY(id : number) : number {
    let y = getInnerY(id);
    if (id == 0 || id == 2) {
      // y += 6;
      y -= 7
    }
    else if (id == 1 || id == 3) {
      // y -= 7;
      y +=6
    }
    else if (id == 5 || id == 6) {
      y -= 13
    }
    else {
      y += 6
    }
    return y
  }

  function getButtonLocationY2(id: number ) : number {
    let y = getButtonLocationY(id);
    if (id > 3) {
      y += 6
    }
    return y
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
    let y = 28;
    if (id == 0) {
      y = 18
    }
    else if (id <=4) {
      y = 23
    }
    return y;
  }


function calculateAngle(index1: number,index2:number): number {
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
  // console.log(outAngle)
  return outAngle
}

// console.log(calculateAngle(2,1))
// const determiningAngle = 180/Math.PI*Math.atan(9/6);

function getRotationXGun(index: number, target: number): number {
  const angle=calculateAngle(index,target);
  // console.log(`Index: ${index} Angle: ${angle}`)
  // let x = getX(index)+5-0.5*Math.cos(angle*Math.PI/180);
  let x = getX(index)+5;
  x += 9*Math.cos(angle*Math.PI/180);
  return x

}


function getRotationYGun(index: number, target: number): number {
  const angle=calculateAngle(index,target);
  // let y = getY(index)+0.5*Math.abs(Math.sin(angle*Math.PI/180));
  let y = getY(index)+0.5;
  y += 9*Math.sin(angle*Math.PI/180);
  return y
}

// function getRotationXBullet(index: number, target: number) : number {

//   return 0
// }

function getBulletChangeX(index: number, target: number) : number {
  const angle=calculateAngle(index,target);
  let x = 0;
  if (flipped(index,target) || angle == -90) {
    x -= 5;
  }
  const radAngle = angle*Math.PI/180;
  x +=-2*Math.sin(radAngle)
  return x
}

function getBulletDistanceChangeX(index: number, target: number) : number {
  const angle=calculateAngle(index,target);
  let x = 0;
  const radAngle = angle*Math.PI/180;
  x +=-4*Math.cos(radAngle)
  return x
}

function getBulletChangeY(index: number, target: number) : number {
  const angle=calculateAngle(index,target);
  let y = 0;
  if (flipped(index,target) || angle == -90) {
    y -= 5;
  }
  const radAngle = angle*Math.PI/180;
  y +=-2*Math.cos(radAngle)
  return y
}

function getBulletDistanceChangeY(index: number, target: number) : number {
  const angle=calculateAngle(index,target);
  let y = 0;
  const radAngle = angle*Math.PI/180;
  y +=-4*Math.sin(radAngle)
  return y
}


// function getLootCardColor(type: LootType): string {
//   if (type == LootType.cash) {
//     return "rgb(169, 216, 158)"
//   }
//   else if (type == LootType.clip) {
//     return "rgb(184, 190, 135)"
//   }
//   else if (type == LootType.gem) {
//     return "rgb(159, 209, 214)"
//   }
//   else if (type == LootType.godfather) {
//     return "rgb(190, 190, 190)"
//   }
//   else if (type == LootType.medKit) {
//     return "rgb(221, 171, 171)"
//   }
//   else if (type == LootType.nft) {
//     return "rgb(194, 157, 205)"
//   }
//   return "black"
// }

function getLootCardColor(type: LootType): string {
  if (type == LootType.cash) {
    return "rgb(120, 210, 100)"
  }
  else if (type == LootType.clip) {
    return "rgb(201, 210, 90)"
  }
  else if (type == LootType.gem) {
    return "rgb(100, 200, 210)"
  }
  else if (type == LootType.godfather) {
    return "rgb(125, 125, 125)"
  }
  else if (type == LootType.medKit) {
    return "rgb(220, 125, 125)"
  }
  else if (type == LootType.nft) {
    return "rgb(180, 100, 205)"
  }
  return "black"
}

function getLootCardStrokeColor(type: LootType): string {
  if (type === LootType.cash) {
    return "rgb(61, 165, 37)"
  }
  else if (type === LootType.clip) {
    return "rgb(198, 213, 35)"
  }
  else if (type === LootType.gem) {
    return "rgb(70, 155, 160)"
  }
  else if (type === LootType.godfather) {
    return "rgb(100, 100, 100)"
  }
  else if (type === LootType.medKit) {
    return "rgb(190, 90, 90)"
  }
  else if (type === LootType.nft) {
    return "rgb(155, 60, 185)"
  }
  return "black"
}



function Game() {
  const socket = useContext(SocketContext);
  const [playerNames,setPlayerNames] = useState<string[]>([""]);
  const [playerHealth,setPlayerHealth] = useState<number[]>([]);
  const [phase,setPhase] = useState<Phase>(Phase.LoadAndAim)
  const [bulletChoice,setBulletChoice] = useState(false);
  const [playerButtons,setPlayerButtons] = useState(Boolean);
  const [playerArray, setPlayerArray] = useState<Player[]>([]);
  const [completedPhase,setCompletedPhase] = useState(false);
  // const [hiding, setHiding] = useState(false);
  const [hidingArray, setHidingArray] = useState<boolean[]>([false])
  const [damagedArray, setDamagedArray] = useState<boolean[]>([false])
  const [deadArray, setDeadArray] = useState<boolean[]>([false])
  const [lootDict,setLootDict] = useState<Record<number,Loot>>({});
  // const [circleStrokeColor,setCircleStrokeColor] = useState("black");
  const [targetArray,setTargetArray] = useState<number[]>([]);
  const [ammo,setAmmo] = useState(-1)
  const [hoverIndex,setHoverIndex] = useState(-1);
  const [hoverBullet,setHoverBullet] = useState(Boolean);
  const [hoverBlank,setHoverBlank] = useState(Boolean);
  const [lootTurnIndex,setLootTurnIndex] = useState<number>(-1)
  const [boughtItemIndex,setBoughtItemIndex] = useState<number>(-1) 
  const [itemAnimation,setItemAnimation] = useState<boolean>(false);
  const [lootTurn,setLootTurn] = useState(false);
  const [godfatherIndex,setGodfatherIndex] = useState<number>(0);
  const [skipHover,setSkipHover] = useState<boolean>(false);
  const [round,setRound] = useState<number>(0);
  const [totalAlivePlayers, setTotalAlivePlayers] = useState<number>(0);
  const [bulletArray,setBulletArray] = useState<number[]>([]);
  const [bulletAnimation,setBulletAnimation] = useState<boolean>(false);
  const [lootHovers,setLootHovers] = useState<boolean[]>([false,false,false,false,false,false,false,false,false])
  const [winners, setWinners] = useState<Player[]>([]);
  const [winnersString, setWinnersString] = useState<string>("");
  const [gunHoverIndex, setGunHoverIndex] = useState<number>(-1);
  const [playerTableHover, setPlayerTableHover] = useState<boolean>(false);

  const {state} = useLocation()
  const room = state.room;
  const thisId = state.id;
  // before i get to the end, need to change the above so it is dependent on the localStorage instead
  const [thisPlayer,setThisPlayer] = useState<Player>(new Player("",""))

  console.log(playerArray)
  
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



  function itemTaken(index: number): void {
    socket.emit("addItemToPlayer", index, thisId,room);
  }

  function playerClicked(index: number): void {
    if (phase == Phase.LoadAndAim) {
      setCompletedPhase(true);
      const val = [...targetArray]
      val[thisId] = index;
      setTargetArray(val);
      socket.emit("sendBulletAndTarget",ammo,index,thisId,room);
    }
    else if (phase == Phase.GodfatherPriv) {
      if (thisId == godfatherIndex) {
        socket.emit("sendGodfatherDecision",thisId,index,room);
      }
      else {
        const val = [...targetArray]
        val[thisId] = index;
        setTargetArray(val);
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
      src = "../public/images/bossBadge.svg";
    }
    else if (type == LootType.medKit) {
      src = "../public/images/heart.svg";
    }
    else if (type == LootType.nft) {
      src = "../public/images/nft.svg";
    }
    return src
  }

  const doNothing = () => {

  }

  const handleShotAnimationComplete = () => {
    if (bulletAnimation) {
      // console.log("Shots fired complete")
      socket.emit("requestGameState",room)
    }
    setBulletAnimation(false)
  }

  if (bulletAnimation) {
    console.log("YESSSSSS")
  }
  // function handleShotAnimationComplete(): void {
  //   if (thisId === 0 && bulletAnimation) {
  //     socket.emit("shotsFiredComplete",room)
  //   }
  //   setBulletAnimation(false)
  // }

  const handleEmittingItemAnimationOver = () => {
    setItemAnimation(false);
    if (thisId === lootTurnIndex) {
      socket.emit("itemAnimationComplete",boughtItemIndex,thisId,room);
    }
  }
  


//   setRoom(state.room)

//   const handleSubmit = (e:FormEvent) => {
//     e.preventDefault();
    useEffect(() => {
      socket.emit("requestInitialState", room)
    },[room])

    useEffect(() => {
      switch (phase) {
        case "LOADANDAIM" : 
          setBulletChoice(true);
          break;
        case "GODFATHERPRIV" :
          if (totalAlivePlayers > 2) {
            if (!completedPhase) {
              // setCompletedPhase(true);
              setPlayerButtons(true);
            }
            else {
              setPlayerButtons(false)
            }
          }
          else {
            skipGodFatherPriv();
          }
          break
        // case "SHOOTING": 
          // if (thisId == 0) {
          //   socket.emit("shotsFiredComplete", room);
          //   // THIS WILL BE FIXED TO SHOW THE ACTUAL COOL ANIMATIONS
          // }
          // setBulletAnimation(true);
          break
        default:
          setPlayerButtons(false)
    }},[phase,completedPhase])


    // useEffect(() => {
    //   // socket.on()
    // })
    


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
    //      
    //       setLootDict(lootDictIn);
    //     }

    //     socket.on("sendLootDict",handleSendLootDict);

    //     return () => {
    //       socket.off("sendLootDict",handleSendLootDict);
    //     }
    // })


    // useEffect(() => {
    //     // socket.emit("requestPlayersAndPhase", room,["INIT"])

    //     // const handleSendNames = (playerArrayIn: Player[]) 

    //     const handleSendPlayersAndPhase = (playerArrayIn: Player[], phaseIn: Phase, changes: string[]) => {
    //       setPhase(phaseIn);
    //       setThisPlayer(playerArrayIn[thisId]);
    //       setCompletedPhase(playerArrayIn[thisId].completedPhase);
    //       for (const change of changes) {
    //           if (change == "INIT") {
    //             changeInit(playerArrayIn);
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


    // // }

    //                       <g id="choices">
    //                   <g id="stay" onClick={() => {
    //                     hidingChosen(false);
    //                     setHoverBullet(false);
                        
    //                   }} onMouseEnter={() => setHoverBullet(true)} 
    //                       onMouseLeave={() => setHoverBullet(false)}>
    //                     <rect x="40" y="20" width="5" height="10" fill="grey" stroke={hoverBullet ? ("yellow") : ("black")} strokeWidth={hoverBullet ? ("0.2") : ("0.1")}></rect>
    //                     <text className="text" x="41" y="25" fontSize="1">Stay</text>
    //                   </g>
    //                   <g id="hide" onClick={() => {
    //                     hidingChosen(true);
    //                     setHoverBlank(false);
    //                   }} onMouseEnter={() => setHoverBlank(true)} 
    //                     onMouseLeave={() => setHoverBlank(false)}>
    //                     <rect x="60" y="20" width="5" height="10" fill="grey" stroke={hoverBlank ? ("yellow") : ("black")} strokeWidth={hoverBlank ? ("0.2") : ("0.1")}></rect>
    //                     <text className="text" x="61" y="25" fontSize="1">Hide</text>
    //                   </g>
    //                   </g>) : null}
    function resetLootHovers() {
      setLootHovers([false,false,false,false,false,false,false,false,false])
    }
    const shotsImages = bulletArray.map((bullet: number, index: number) => {
        return (bullet == 1 && !hidingArray[index] && !deadArray[index]) ? (
          <motion.image
            href={getImage(LootType.clip)}
            width={4}
            height={4}
            initial={{
              rotate: `${calculateAngle(index, targetArray[index]) + 90}deg`, // applied once
              x:getRotationXGun(index,targetArray[index]) + getBulletChangeX(index,targetArray[index]),
              y:getRotationYGun(index,targetArray[index]) + getBulletChangeY(index,targetArray[index]),
            }}
            animate={{
              x: getX(targetArray[index])+5 + getBulletChangeX(index,targetArray[index]) + getBulletDistanceChangeX(index,targetArray[index]),
              y: getY(targetArray[index])+0.5 + getBulletChangeY(index,targetArray[index]) + getBulletDistanceChangeY(index,targetArray[index]),
            }}
            transition={{
              duration:2.4
            }}
            onAnimationComplete={handleShotAnimationComplete}
          />
        ) : (
          <g>
          <motion.image
            // IT WOULD BE COOL IF IT COULD BE A MIST EFFECT TYPE THING THAT ACCUMULATES
            href={"../public/images/explosion.svg"}
            width={4}
            height={4}
            // style={{["--hold" as any]: 0}}
            opacity={0.99}
            initial={{
              rotate: `${calculateAngle(index, targetArray[index]) + 90}deg`, // applied once
              x:getRotationXGun(index,targetArray[index]) + getBulletChangeX(index,targetArray[index]),
              y:getRotationYGun(index,targetArray[index]) + getBulletChangeY(index,targetArray[index]),
              clipPath: "inset(0 100% 0 0)"
            }}
            animate={{ clipPath: "inset(0 0% 0 0)",
              opacity: 1
             }}     // slide in left → right
            transition={{
              clipPath: {duration: 1},
              opacity: {duration: 2.4}
            }}
            // animate={{
            //   x: getX(targetArray[index])+5 + getBulletChangeX(index,targetArray[index]) + getBulletDistanceChangeX(index,targetArray[index]),
            //   y: getY(targetArray[index])+0.5 + getBulletChangeY(index,targetArray[index]) + getBulletDistanceChangeY(index,targetArray[index]),
            // }}
            // transition={{
            //   duration:2.4
            // }}
            onAnimationComplete={handleShotAnimationComplete}
          />
          </g>
        ) 
      }
    )

    function gunOrShieldImage(choiceVal: number) : JSX.Element {
      const bulletHoverFunctions = [setHoverBullet,setHoverBlank];
      const bulletHoverFunction = bulletHoverFunctions[choiceVal];
      const bulletHoverVals = [hoverBullet,hoverBlank];
      const bulletLocationX = [getButtonLocationX2, getButtonLocationX];
      const bulletLocationY = [getButtonLocationY2, getButtonLocationY];
      const bulletImages = [gunImage, shieldImage];
      return <g onClick={() => {
                        bulletHoverFunction(false);
                        hidingChosen(choiceVal > 0)
                        
                      }} onMouseEnter={() => bulletHoverFunction(true)} 
                          onMouseLeave={() => bulletHoverFunction(false)}>
                        {/* <rect x="40" y="20" width="5" height="10" fill="grey" stroke={hoverBullet ? ("yellow") : ("black")} strokeWidth={hoverBullet ? ("0.2") : ("0.1")}></rect> */}
                        {/* <text className="text" x="41" y="25" fontSize="1">Bullet</text> */}
                        <motion.image 
                          x={bulletLocationX[choiceVal](thisId)} 
                          y={bulletLocationY[choiceVal](thisId)}
                          href={bulletImages[choiceVal]} 
                          width="4" 
                          height="4" 
                          filter={bulletHoverVals[choiceVal] ? ("drop-shadow(0 0 0.5 yellow)"): "none"}
                          animate={{
                            scale: [1,1.2,1]
                          }}
                          transition={{
                            scale: {duration: 1.2, repeat: Infinity, ease:"easeInOut"}
                          }}
                          // fill="grey" 
                          // stroke={hoverBullet ? ("yellow") : ("black")} 
                          // strokeWidth={hoverBullet ? ("0.2") : ("0.1")}
                        />

                        {/* <rect x={getButtonLocationX(thisId)} y={getButtonLocationY(thisId)} width="1" height="2" fill="grey" stroke={hoverBullet ? ("yellow") : ("black")} strokeWidth={hoverBullet ? ("0.2") : ("0.1")}></rect> */}
                        {/* <text className="text" x="41" y="25" fontSize="1">Bullet</text> */}
                      </g>
    }

    function bulletImage(bulletVal: number) : JSX.Element {
      const bulletHoverFunctions = [setHoverBlank,setHoverBullet];
      const bulletHoverFunction = bulletHoverFunctions[bulletVal];
      const bulletHoverVals = [hoverBlank,hoverBullet];
      const bulletLocationX = [getButtonLocationX2, getButtonLocationX];
      const bulletLocationY = [getButtonLocationY2, getButtonLocationY];
      const bulletImages = [blankImage, getImage(LootType.clip)];
      return <g onClick={() => {
                        setBulletChoice(false);
                        bulletHoverFunction(false);
                        setPlayerButtons(true);
                        setAmmo(bulletVal)
                        
                      }} onMouseEnter={() => bulletHoverFunction(true)} 
                          onMouseLeave={() => bulletHoverFunction(false)}>
                        {/* <rect x="40" y="20" width="5" height="10" fill="grey" stroke={hoverBullet ? ("yellow") : ("black")} strokeWidth={hoverBullet ? ("0.2") : ("0.1")}></rect> */}
                        {/* <text className="text" x="41" y="25" fontSize="1">Bullet</text> */}
                        <motion.image 
                          x={bulletLocationX[bulletVal](thisId)} 
                          y={bulletLocationY[bulletVal](thisId)}
                          href={bulletImages[bulletVal]} 
                          width="4" 
                          height="4" 
                          filter={bulletHoverVals[bulletVal] ? ("drop-shadow(0 0 0.5 yellow)"): "none"}
                          animate={{
                            scale: [1,1.3,1]
                          }}
                          transition={{
                            scale: {duration: 1.2, repeat: Infinity, ease:"easeInOut"}
                          }}
                          // fill="grey" 
                          // stroke={hoverBullet ? ("yellow") : ("black")} 
                          // strokeWidth={hoverBullet ? ("0.2") : ("0.1")}
                        />

                        {/* <rect x={getButtonLocationX(thisId)} y={getButtonLocationY(thisId)} width="1" height="2" fill="grey" stroke={hoverBullet ? ("yellow") : ("black")} strokeWidth={hoverBullet ? ("0.2") : ("0.1")}></rect> */}
                        {/* <text className="text" x="41" y="25" fontSize="1">Bullet</text> */}
                      </g>
    }

    function playerImage (name: string, index: number): JSX.Element {
      let sizes = 2;
      let playerSize = 13;
      // if (index == thisId) {
      //   sizes = 3
      //   playerSize = 15;
      // }
      return <g>
            {/* <rect x={getX(index)+2} y={getY(index)-5} height={9} width={6} fill="blue"/> */}
            {/* <circle cx={getX(index)+5} cy={getY(index)} r="5" fill={"yellow"} stroke="none"></circle> */}

            {/* <circle cx={getX(index)+5} cy={getY(index)} r="5" fill={((playerButtons) && (!deadArray[index]) && (index!== thisId) && !((phase=="GODFATHERPRIV") && (thisId !== godfatherIndex) && (index === targetArray[thisId]))) ? "yellow" : "none"} stroke="none"></circle> */}
            {/* <image 
              style={{
                filter: `drop-shadow(0 0 8px ${"blue"})`
              }} 
              href="../public/images/character.svg" 
              height={hoverIndex==index ? (playerSize+1):(playerSize+1)} 
              width={hoverIndex==index ? (playerSize+1):(playerSize+1)} 
              x={hoverIndex==index ? (getX(index)-2):(getX(index)-2)} 
              y={hoverIndex==index ? (getY(index)-7):(getY(index)-7)}>
            </image> */}
            {deadArray[index] ? 
            (<image 
              href={"../public/images/skull.svg"} 
              height={9} 
              width={9} 
              x={getX(index)+0.5} 
              y={getY(index)-5}
              // style={{filter: index==lootTurnIndex ? (`drop-shadow(0 0 0.5px ${"blue"})`) : ("none")}}
              // opacity={hidingArray[index] ? 0.3: 1}
            />): 
            (
              <motion.image 
              href={"../public/images/character.svg"} 
              height={hoverIndex==index ? (playerSize+1):(playerSize)} 
              width={hoverIndex==index ? (playerSize+1):(playerSize)} 
              x={hoverIndex==index ? (getX(index)-2):(getX(index)-1.5)} 
              y={hoverIndex==index ? (getY(index)-7):(getY(index)-6.5)}
              // style={{filter: index==lootTurnIndex ? (`drop-shadow(0 0 0.5px ${"blue"})`) : ("none")}}
              opacity={(hidingArray[index] && phase == Phase.Looting) ? 0.3: 1}

              animate={
                ((playerButtons) && (!deadArray[index]) && (index!== thisId) && !((phase=="GODFATHERPRIV") && (thisId !== godfatherIndex) && (index === targetArray[thisId])))
                ? {
                // filter: [
                //   "drop-shadow(0 0 0px rgba(255,255,0,1))", // start small glow
                //   "drop-shadow(0 0 0.5px rgba(255,255,0,1))", // expand glow
                //   "drop-shadow(0 0 0px rgba(255,255,0,1))", // back to small
                // ]
                  filter: [
                        // smaller, tighter aura
                        `
                          drop-shadow(0 0 1px rgba(255, 255, 0, 1))
                          drop-shadow(0 0 2px rgba(255, 255, 0, 0.9))
                          saturate(2)
                        `,
                        // larger, stronger aura
                        `
                          drop-shadow(0 0 0px rgba(255, 255, 0, 1))
                          drop-shadow(0 0 0px rgba(255, 255, 0, 0.9))
                          saturate(2)
                        `,
                        // back to smaller
                        `
                          drop-shadow(0 0 1px rgba(255, 255, 0, 1))
                          drop-shadow(0 0 2px rgba(255, 255, 0, 0.9))
                          saturate(2)
                        `,
                      ],
              } 
                :
                {
                  filter: index==lootTurnIndex 
                  ? (`drop-shadow(0 0 0.5px ${"blue"})`) : ("none")
                }

              }
              transition={
                // ((playerButtons) && (!deadArray[index]) && (index!== thisId) && !((phase=="GODFATHERPRIV") && (thisId !== godfatherIndex) && (index === targetArray[thisId])))
                // ? {
                //   duration: 1,
                //   repeat: Infinity,
                //   repeatType: "loop",
                //   ease: "easeInOut"
                // }
                // : 
                {duration: 0}
              }
              />
            )}
            
            <text className="text" x={getX(index)+5-(name.length)/2} y={getY(index)-5.5} fontSize={sizes}>{name}</text>
            <image href={heartImage} x={getX(index)+sizes} y={getY(index)+4} height={sizes} width={sizes} opacity={playerHealth[index] > 0 ? 1: 0.4}/>
            <image href={heartImage} x={getX(index)+2*sizes} y={getY(index)+4} height={sizes} width={sizes} opacity={playerHealth[index] > 1 ? 1: 0.4}/>
            <image href={heartImage} x={getX(index)+3*sizes} y={getY(index)+4} height={sizes} width={sizes} opacity={playerHealth[index] > 2 ? 1: 0.4}/>
            {index == godfatherIndex ? 
            (<image href={getImage(LootType.godfather)} x={getX(index)+1.5} y={getY(index)+1} height="3" width="3"/>) : null
            }
            {hidingArray[index] ? 
            (<image href={shieldImage} x={getX(index)+1.5} y={getY(index)-3.5} height={7} width={7}/>) : null
            }
      </g>
    }



    function playerTable(index: number): JSX.Element  {
      if (playerArray.length == 0) {
        return <g></g>
      }
      let x = getInnerX(index);
      let y = getInnerY(index);
      let width = getWidth(index);
      let height = getHeight(index);
      // console.log(playerArray)
      return <g>
              <rect x={getContainerX(index)} y={getContainerY(index)} width={width} height={height} fill="tan" stroke="black" strokeWidth={0.2}/>
              <rect x={getButtonLocationX(index)-0.5} y={getButtonLocationY(index)-1} width={index < 4 ? 10 : 5} height={index < 4 ? 6 : 12} fill="white" stroke="black" strokeWidth={0.1}></rect>
              {/* <g onMouseEnter={() => setPlayerTableHover(true)} onMouseLeave={() => setPlayerTableHover(false)}> */}
              <g>
                <rect x={x} y={y-1} width="10" height="5" fill="white" stroke="black" strokeWidth="0.1" opacity={phase !== Phase.Gambling ? 1 : 0.3}></rect>
                <text className="text" x={x+0.1} y={y+0.75} fontSize="2" opacity={phase !== Phase.Gambling ? 1 : 0.3}>${playerArray[index].money}</text>
                <image href={getImage(LootType.gem)} x={x+2} y={y+2} height="2" width="2" opacity={phase !== Phase.Gambling ? 1 : 0.3}/>
                <text className="text" x={x+1} y={y+3.5} fontSize="2" opacity={phase !== Phase.Gambling ? 1 : 0.3}>{playerArray[index].gems}</text>
                <image href={getImage(LootType.nft)} x={x+8} y={y+1.75} height="2" width="2" opacity={phase !== Phase.Gambling ? 1 : 0.3}/>
                <text className="text" x={x+7} y={y+3.5} fontSize="2" opacity={phase !== Phase.Gambling ? 1 : 0.3}>{playerArray[index].nft}</text>
                {Array.from({length: playerArray[index].bullets}).map((_, i: number) => (
                  <image key={i} href={getImage(LootType.clip)} x={x+8.5-i*0.5} y={y-0.9} height="2" width="2" opacity={phase !== Phase.Gambling ? 1 : 0.3}/>
                ))}
              </g>
            </g>
    }
    
    console.log(winnersString)
    console.log(phase)
    // console.log()
    const myGunAndBullet = useMemo(() => {
      const target = targetArray[thisId];
      const index = thisId;
      let bullet : number;
      if (phase === Phase.LoadAndAim && ammo != -1) {
        bullet = ammo;
      }
      else {
        bullet = bulletArray[thisId];
      }
      // if (phase == Phase.LoadAndAim) {
      //   return null
      // }
      return <g>
          <g onMouseEnter={() => setGunHoverIndex(index)} onMouseLeave={() => setGunHoverIndex(-1)}>
          {flipped(index, target) ? 
          (<image href={gunImageLeft} height="4" width="4" x={getX(index)-4} y={getY(index)} transform={`rotate(${180+calculateAngle(index,target)}, ${getX(index)+5}, ${getY(index)})`} />) :
          (<image href={gunImage} height="4" width="4" x={getX(index)+10} y={getY(index)} transform={`rotate(${calculateAngle(index,target)}, ${getX(index)+5}, ${getY(index)})`} />)
          }
          </g>
          {gunHoverIndex === index ? 
          <line key={index} x1={getRotationXGun(index,target)} x2={getX(target)+5} y1={getRotationYGun(index,target)} y2={getY(target)+0.5} stroke="black" strokeDasharray={"0.1 1"} strokeLinecap="round" strokeWidth={0.2}/>
          : null}
          {(bullet == 1 && !hidingArray[index]) ? (
          <motion.image
            href={getImage(LootType.clip)}
            width={4}
            height={4}
            // x={getX(index)+2.5} y={getY(index)-14}
            // transform={`rotate(${90+calculateAngle(index,target)}, ${getX(index)+5}, ${getY(index)})`}
            initial={{
              rotate: `${calculateAngle(index, targetArray[index]) + 90}deg`, // applied once
              x:getRotationXGun(index,targetArray[index]) + getBulletChangeX(index,targetArray[index]),
              y:getRotationYGun(index,targetArray[index]) + getBulletChangeY(index,targetArray[index]),
            }}
          />
        ) : (
          <motion.image
            // IT WOULD BE COOL IF IT COULD BE A MIST EFFECT TYPE THING THAT ACCUMULATES
            href={blankImage}
            width={4}
            height={4}
            initial={{
              rotate: `${calculateAngle(index, targetArray[index]) + 90}deg`, // applied once
              x:getRotationXGun(index,targetArray[index]) + getBulletChangeX(index,targetArray[index]),
              y:getRotationYGun(index,targetArray[index]) + getBulletChangeY(index,targetArray[index]),
            }}

          />
          )}
      </g>
    },[phase, targetArray, bulletArray, gunHoverIndex, ammo])

    const guns = useMemo(() => {
      return targetArray.map((target:number,index:number) => (
        ((!deadArray[index]) && (index !== thisId || phase===Phase.Shooting) && (phase != Phase.Shooting || !hidingArray[index])) && (<g key={index}>
          <g onMouseEnter={() => setGunHoverIndex(index)} onMouseLeave={() => setGunHoverIndex(-1)}>
          {flipped(index, target) ? 
          (<image href={gunImageLeft} height="4" width="4" x={getX(index)-4} y={getY(index)} transform={`rotate(${180+calculateAngle(index,target)}, ${getX(index)+5}, ${getY(index)})`} />) :
          (<image href={gunImage} height="4" width="4" x={getX(index)+10} y={getY(index)} transform={`rotate(${calculateAngle(index,target)}, ${getX(index)+5}, ${getY(index)})`} />)
          }
          {/* <line key={index} x1={(getX(index)== getX(target)) ? (getX(index)+5) : ((getX(index)+5) + (getX(target)-getX(index))*5/(Math.abs(getX(target)-getX(index))))} x2={getX(target)+5} y1={(getY(index) == getY(target)) ? getY(index) : (getY(index) + (getY(target)-getY(index))/(Math.abs(getY(target)-getY(index))))} y2={getY(target)} stroke="black" strokeWidth="0.2"/> */}
          </g>
          {gunHoverIndex === index ? 
          <line key={index} x1={getRotationXGun(index,target)} x2={getX(target)+5} y1={getRotationYGun(index,target)} y2={getY(target)+0.5} stroke="black" strokeDasharray={"0.1 1"} strokeLinecap="round" strokeWidth={0.2}/>
          : null}
          {/* <line key={`${index}-hi `} x1={getX(index)+5} x2={getX(target)+5} y1={getY(index)} y2={getY(target)} stroke="green" strokeWidth="0.2"/> */}
          {/* <circle cx={getX(index)+5} cy={getY(index)} r="1" /> */}
          {/* <circle cx={(getX(index)+5) + (getX(target)-getX(index))*5/(Math.abs(getX(target)-getX(index)))} cy={getY(index) + (getY(target)-getY(index))*2.5/(Math.abs(getY(target)-getY(index)))} r="1"/> */}
      </g>)))},[targetArray,phase, gunHoverIndex]);

    const lootImages = useMemo(() => {
      return Object.values(lootDict).map((value: Loot, index: number) => 
        value.type !== LootType.empty ? (
          <motion.g key={index} onClick={lootTurn && phase===Phase.Looting ? (() => {
            itemTaken(index);
            setLootTurn(false);
            resetLootHovers;
            }) : doNothing} 
            onMouseEnter={lootTurn && phase===Phase.Looting ? (() => {
              const newLootHovers=[false,false,false,false,false,false,false,false,false]
              newLootHovers[index] = true;
              setLootHovers(newLootHovers)
            }) : doNothing}
            onMouseLeave={lootTurn && phase===Phase.Looting ? (
              resetLootHovers
            ) : doNothing}
            
            // stroke={lootTurn ? ("green") : "none"} strokeWidth="0.1"
              // height={4}
              // width={8}
              // stroke={lootTurn && lootHovers[index] ? ("green") : "none"}
              initial={{x:getLootX(index)-1, y:getLootY(index)}}
              opacity={phase === Phase.Looting ? 1 : 0.3}
              animate={
                {
                  x: (itemAnimation && index==boughtItemIndex) ? (getX(lootTurnIndex)+5) : (getLootX(index)+1), 
                  y: (itemAnimation && index==boughtItemIndex) ? (getY(lootTurnIndex))  : (getLootY(index)+0.5),
                  scale: (lootTurn ? [1,1.1,1] : [1,1,1])
                }} 
              transition={{
                x: {duration: 0.5},
                y: {duration: 0.5},
                scale: {duration: 1.2, repeat: Infinity, ease: "easeInOut"}
              }}
              onAnimationComplete={(itemAnimation && index==boughtItemIndex) ? (handleEmittingItemAnimationOver) : doNothing}
            
            
            >
            {/* {lootTurn ?  (
              <circle className="pulse" fill="yellow" cx={getLootX(index)+3} cy={getLootY(index)+2} r="3"/>
            ): null} */}
            {/* <rect x={getLootX(index)-1} y={getLootY(index)} height={4} width={8} fill={getLootCardColor(value.type)} stroke={getLootCardStrokeColor(value.type)} strokeWidth={0.2}/>
            <circle cx={getLootX(index)+3} cy={getLootY(index)+2} r={1.75} fill={getLootCardColor(value.type)} stroke={getLootCardStrokeColor(value.type)} strokeWidth={0.1}/>
            <text className={"text"} x={getLootX(index)-0.75} y={getLootY(index)+1} fontSize={1} fill={getLootCardStrokeColor(value.type)}>{value.value > 0 ? ("$"+value.value/1000+"K") : ""}</text>
            <text className={"text"} x={getLootX(index)+4.5} y={getLootY(index)+3.75} fontSize={1} fill={getLootCardStrokeColor(value.type)}>{value.value > 0 ? ("$"+value.value/1000+"K") : ""}</text> */}
            <rect x={0} y={0} height={4} width={8} stroke={"black"} strokeWidth={0.5} style={{filter: lootTurn && lootHovers[index] ? ("drop-shadow(0 0 1px green)"): "none"}}/>
            <rect x={0} y={0} height={4} width={8} fill={getLootCardColor(value.type)} stroke={getLootCardStrokeColor(value.type)} strokeWidth={0.3}/>
            <rect x={0.1} y={0.1} height={3.8} width={7.8} fill={"transparent"} stroke={"black"} strokeWidth={0.1}/>            
            <circle cx={4} cy={2} r={1.75} fill={getLootCardColor(value.type)} stroke={"black"} strokeWidth={0.1}/>
            <text className={"text"} x={0.25} y={1} fontSize={1} fill={"black"}>{value.value > 0 ? ("$"+value.value/1000+"K") : ""}</text>
            <text className={"text"} x={5.5} y={3.75} fontSize={1} fill={"black"}>{value.value > 0 ? ("$"+value.value/1000+"K") : ""}</text>            
            <image 
              // className="pulse"
              href={getImage(value.type)} 
              height="3" 
              width="4" 
              // style={{filter: lootTurn ? ("drop-shadow(0 0 1px green)") : null}}
              // className="lootGlow"
              // filter={lootTurn ? ("drop-shadow(0 0 1px green)"): "none"}
              x={2}
              y={0.5}
              // className={lootTurn ? "lootGlow" : ""}
              // initial={{x:getLootX(index+1), y:getLootY(index)+0.5}}
              // animate={
              //   {x: (itemAnimation && index==boughtItemIndex) ? (getX(lootTurnIndex)+5) : (getLootX(index)+1), 
              //     y: (itemAnimation && index==boughtItemIndex) ? (getY(lootTurnIndex))  : (getLootY(index)+0.5),
              //     scale: (lootTurn ? [1,1.2,1] : [1,1,1])
              //   }} 
              // transition={{
              //   x: {duration: 0.5},
              //   y: {duration: 0.5},
              //   scale: {duration: 1.2, repeat: Infinity, ease: "easeInOut"}
              // }}
              // onAnimationComplete={(itemAnimation && index==boughtItemIndex) ? (handleEmittingItemAnimationOver) : doNothing}
              />
            {/* <motion.text 
              className="text"
              opacity={phase === Phase.Looting ? 1 : 0.3}
              initial={{x: getLootX(index)+0.5, y: getLootY(index)+2}} 
              animate={{
                x: (itemAnimation && index==boughtItemIndex) ? (getX(lootTurnIndex)+5) : (getLootX(index)+0.5), 
                y: (itemAnimation && index==boughtItemIndex) ? (getY(lootTurnIndex))  : (getLootY(index)+2),
                scale: (lootTurn ? [1,1.2,1] : [1,1,1])
              }}
              transition={{
                x: {duration: 0.5},
                y: {duration: 0.5},
                scale: {duration: 1.2, repeat: Infinity, ease: "easeInOut"}
              }}

              fontSize="2">{value.value > 0 ? ("$"+value.value) : ""}
            </motion.text> */}
          </motion.g>) : null
        )
    },[phase, lootDict, lootTurn, boughtItemIndex, itemAnimation, lootHovers])

    // console.log(completedPhase)
    useEffect(() => {
      const handleGetNames = (playerArray: Player[]) => {
        setPlayerNames(playerArray.map(player => player.name));
      }

      const handleGetGameState = (gameState: GameState)  => {
        setGodfatherIndex(gameState.bossId);
        setLootDict(gameState.lootDict);
        setLootTurnIndex(gameState.lootTurnPlayerIndex);
        setLootTurn(gameState.lootTurnPlayerIndex === thisId);
        setRound(gameState.round);
        const playerArray = gameState.playerArray;
        setPlayerArray(gameState.playerArray);
        const thisPlayer = playerArray[thisId];
        setPlayerHealth(playerArray.map(player => player.health));
        setThisPlayer(thisPlayer);
        setAmmo(thisPlayer.bulletChoice);
        setCompletedPhase(thisPlayer.completedPhase);
        setHidingArray(playerArray.map(player => player.hiding));
        setDamagedArray(playerArray.map(player => player.damaged))
        setDeadArray(playerArray.map(player => player.dead))
        setTargetArray(playerArray.map(player => player.target));
        setBoughtItemIndex(-1);
        setTotalAlivePlayers(gameState.totalAlivePlayers);
        setBulletArray(playerArray.map(player => player.bulletChoice));
        setBulletAnimation(gameState.shooting);
        // setWinners(gameState.winners);
        if (gameState.winners.length > 0) {
          console.log("got here")
          let winnersString : string = "";
          for (let i = 0; i<gameState.winners.length; i++) {
            winnersString += gameState.winners[i].name;
            if (i != gameState.winners.length-1) {
              winnersString += " and "
            }
          }
          setWinnersString(winnersString);
          console.log(winnersString)
        }

        setPhase(gameState.phase);
      }

      const handleSocketDisconnect = (reason: string ) => {
        socket.emit("socketDisconnected",thisId,room)
      }

      const handleItemAnimation = (itemIndex: number, playerIndex: number) => {
        setBoughtItemIndex(itemIndex);
        // setLootTurnIndex
        setItemAnimation(true);
      }
      socket.on("getPlayerNames",handleGetNames)
      socket.on("getGameState",handleGetGameState);
      socket.on("disconnect",handleSocketDisconnect);
      socket.on("animateItem",handleItemAnimation)

      return () => {
        socket.off("getPlayerNames",handleGetNames)
        socket.off("getGameState",handleGetGameState);
        socket.off("disconnect",handleSocketDisconnect);
        socket.off("animateItem",handleItemAnimation)
      }
    },[])

  return <svg id="main" x = "0px" y="0px" xmlns = "http://www.w3.org/2000/svg" viewBox="0 0 100 50">
      <g>
          <rect x="0" y="0" width="100" height={50} fill="white" stroke="black" strokeWidth={0.1}/>
          <text className="text" x="1" y="3" fontSize="3">Round {round+1}</text>

          {phase === Phase.GameOver ? null: lootImages}
          {playerNames.map((name: string, index: number) => 
          <g key={index} onClick={((playerButtons) && (index!== thisId) && (!deadArray[index]) && !((phase=="GODFATHERPRIV") && (thisId !== godfatherIndex) && (index === targetArray[thisId]))) ? (
            () => {
              playerClicked(index);
              setPlayerButtons(false);
              setHoverIndex(-1);
            }
          ): doNothing} onMouseEnter={((playerButtons) && (index!== thisId) && (!deadArray[index]) && !((phase=="GODFATHERPRIV") && (thisId !== godfatherIndex) && (index === targetArray[thisId]))) ? (
            () => setHoverIndex(index)
          ): doNothing} onMouseLeave={((playerButtons) && (index!== thisId)) ? (
            () => setHoverIndex(-1)
          ): doNothing}>
            {(phase === "GAMEOVER" || index === thisId) ? (
              playerTable(index)
            ) : null}
            {playerImage(name,index)}

          </g>
          )}
        {((completedPhase && phase===Phase.LoadAndAim) || phase===Phase.GodfatherPriv || phase===Phase.Gambling) ? myGunAndBullet : null}
        {/* {(completedPhase && !(deadArray[thisId])) ? (
          <text className="text" x="40" y={centerTextY} fontSize="2">Waiting for other players...</text>
        ) : (null)} */}
      </g>
      {deadArray[thisId] && phase!= "GAMEOVER" ? (
        <text x="15" y={centerTextY} fontSize={2} fill="red">YOU ARE ELIMINATED. YOU ARE NOW EFFECTIVELY A SPECTATOR OF THE GAME.</text>
      ) 
      : (<g>
          {(() => {
            switch (phase) {
              case "LOADANDAIM":
                return <g>
                  {(completedPhase && !(deadArray[thisId])) ? (
                    <text className="text" x="30" y={centerTextY} fontSize="2">Waiting for other players to select bullet and target...</text>
                  ) : (null)}
                  {((!bulletChoice) && (!completedPhase)) ? (
                    <text className="text" x="38" y={centerTextY} fontSize="3">Choose a target</text>
                  ): null}
                  {((bulletChoice) && (!completedPhase)) ? (
                    <>
                    <text className="text" x="30" y={centerTextY} fontSize="3">Choose what to load in your gun this round</text>
                    {thisPlayer.bullets > 0 && (bulletImage(1))}
                      {thisPlayer.blanks > 0 && (bulletImage(0))}
                    </>) : null}
                    
                  </g>;
              case "GODFATHERPRIV":
                return <g>
                    {(completedPhase && !(deadArray[thisId])) ? (
                      <text className="text" x="30" y={centerTextY} fontSize="2">Waiting for {playerNames[godfatherIndex]} to use privelege...</text>
                    ) : (null)}
                    {((thisId === godfatherIndex) && playerButtons) ? (
                      <text className="text" x="28" y={centerTextY} fontSize="3">Choose a player to change their target, or skip</text>
                    ): null}
                    {((thisId !== godfatherIndex) && playerButtons) ? (
                      <text className="text" x="30" y={centerTextY} fontSize="3">Choose a different player to target</text>
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
                    {(completedPhase && !(deadArray[thisId])) ? (
                      <text className="text" x="35" y={centerTextY} fontSize="2">Waiting for other players to gamble...</text>
                    ) : (null)}
                    {guns}
                    {(!completedPhase) ? (
                      <g id="choices">
                        <text className="text" x="30" y={centerTextY} fontSize={3}>Choose to hide or stay for the round</text>

                        {gunOrShieldImage(0)}
                        {gunOrShieldImage(1)}
                      </g>
                      ) : null}
                  </g>;
              case "SHOOTING":
                return <g>
                  {guns}
                  {shotsImages}
                  </g>
              case "LOOTING": // need to add the animations and shiet for the shooting
                return <g>
                  {(completedPhase && !(deadArray[thisId])) ? (
                    <text className="text" x="30" y={centerTextY} fontSize="2">Waiting for other players to loot...</text>
                  ) : 
                    (lootTurnIndex != thisId ? <text className="text" x="40" y={centerTextY} fontSize="2">Waiting for {playerNames[lootTurnIndex]} to loot...</text> : <text className="text" x="40" y={centerTextY} fontSize="2">Choose a loot card</text>)
                  }

                  {damagedArray.map((value,index) => 
                  <g key={index}>
                    {value ? (<image href={bandageImage} x={getX(index)+5} y={getY(index)+1} height={2.5} width={2.5}/>) : (null)
                    }
                  </g>)
                  }
                  
                </g>;
              case "GAMEOVER":
                return <g>
                    <text x={40} y={25} fontSize={4}>{winnersString} wins!</text>
                    {/* {playerNames.map((_,index) => (
                      <g key={index}>
                        {(index !== thisId) ? (playerTable(index)): null}
                      </g>
                    ))} */}
                  </g>
            }
          })()}
      </g>)}

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
