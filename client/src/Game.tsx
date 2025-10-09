
import { useContext, useEffect, useState, useMemo, JSX} from "react";
import { motion } from "framer-motion";
import { useLocation} from "react-router-dom";
import { SocketContext } from "./App";
import { GameState, Player , Phase, Loot, LootType} from "../../shared";
import "./App.css";

// const enum Phase {
//     // Reset="RESET",
//     LoadAndAim="LOADANDAIM",
//     GodfatherPriv="GODFATHERPRIV",
//     Gambling="GAMBLING",
//     Shooting="SHOOTING",
//     Looting="LOOTING",
//     // RoundEnd="ROUNDEND"
//     GameOver="GAMEOVER",
// }

// type Phase = "LOADANDAIM" | "GODFATHERPRIV" | "GAMBLING" | "SHOOTING" | "LOOTING" | "GAMEOVER";

const centerTextY = 3
const gunImage = "/images/pistol.svg";
const gunImageLeft = "/images/pistolLeft.svg";
const bandageImage = "/images/bandage.svg";
const heartImage = "/images/heart.svg";
const blankImage = "/images/blank.svg";
const shieldImage = "/images/shield.svg";


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
    return x
  }

  function getContainerY(id: number) : number {
    let y = getInnerY(id)-2;
    if (id == 0 || id == 2) {
      y -= 7
    }
    // if (id == 1 || id == 3) {
    //   // y -= 1
    // }
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
  let outAngle = 180/Math.PI*angle;
  if (xdiff < 0) {
    outAngle += 180;
  }
  return outAngle
}


function getRotationXGun(index: number, target: number): number {
  const angle=calculateAngle(index,target);
  let x = getX(index)+5;
  x += 9*Math.cos(angle*Math.PI/180);
  return x

}


function getRotationYGun(index: number, target: number): number {
  const angle=calculateAngle(index,target);
  let y = getY(index)+0.5;
  y += 9*Math.sin(angle*Math.PI/180);
  return y
}


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



function getLootCardColor(type: LootType): string {
  if (type == "cash") {
    return "rgb(120, 210, 100)"
  }
  else if (type == "clip") {
    return "rgb(201, 210, 90)"
  }
  else if (type == "gem") {
    return "rgb(100, 200, 210)"
  }
  else if (type == "godfather") {
    return "rgb(125, 125, 125)"
  }
  else if (type == "medkit") {
    return "rgb(220, 125, 125)"
  }
  else if (type == "nft") {
    return "rgb(180, 100, 205)"
  }
  return "black"
}

function getLootCardStrokeColor(type: LootType): string {
  if (type === "cash") {
    return "rgb(61, 165, 37)"
  }
  else if (type === "clip") {
    return "rgb(198, 213, 35)"
  }
  else if (type === "gem") {
    return "rgb(70, 155, 160)"
  }
  else if (type === "godfather") {
    return "rgb(100, 100, 100)"
  }
  else if (type === "medkit") {
    return "rgb(190, 90, 90)"
  }
  else if (type === "nft") {
    return "rgb(155, 60, 185)"
  }
  return "black"
}



function Game() {
  const socket = useContext(SocketContext);
  const [playerNames,setPlayerNames] = useState<string[]>([""]);
  const [playerHealth,setPlayerHealth] = useState<number[]>([]);
  const [phase,setPhase] = useState<Phase>("LOADANDAIM")
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
  // const [winners, setWinners] = useState<Player[]>([]);
  const [winnersString, setWinnersString] = useState<string>("");
  const [gunHoverIndex, setGunHoverIndex] = useState<number>(-1);
  // const [playerTableHover, setPlayerTableHover] = useState<boolean>(false);

  const {state} = useLocation()
  const room = state.room;
  const thisId = state.id;
  // before i get to the end, need to change the above so it is dependent on the localStorage instead
  const [thisPlayer,setThisPlayer] = useState<Player>(new Player("",""))

  console.log(playerArray)
  
  // function getColor(health: number) : string {
  //   let color = "black"
  //   if (health == 3) {
  //     color = "green"
  //   }
  //   else if (health == 2) {
  //     color = "yellow"
  //   }
  //   else if (health == 1) {
  //     color = "red"
  //   }

  //   return color
  // }



  function itemTaken(index: number): void {
    socket.emit("addItemToPlayer", index, thisId,room);
  }

  function playerClicked(index: number): void {
    if (phase == "LOADANDAIM") {
      setCompletedPhase(true);
      const val = [...targetArray]
      val[thisId] = index;
      setTargetArray(val);
      socket.emit("sendBulletAndTarget",ammo,index,thisId,room);
    }
    else if (phase == "GODFATHERPRIV") {
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
    if (type == "cash") {
      src = "/images/money.svg";
    }
    else if (type == "clip") {
      src = "/images/bullet.svg";
    }
    else if (type == "gem") {
      src = "/images/gem.svg";
    }
    else if (type == "godfather") {
      src = "/images/bossBadge.svg";
    }
    else if (type == "medkit") {
      src = "/images/heart.svg";
    }
    else if (type == "nft") {
      src = "/images/nft.svg";
    }
    return src
  }

  const doNothing = () => {

  }

  const handleShotAnimationComplete = () => {
    if (bulletAnimation) {
      socket.emit("requestGameState",room)
    }
    setBulletAnimation(false)
  }

  if (bulletAnimation) {
    console.log("YESSSSSS")
  }

  const handleEmittingItemAnimationOver = () => {
    setItemAnimation(false);
    if (thisId === lootTurnIndex) {
      socket.emit("itemAnimationComplete",boughtItemIndex,thisId,room);
    }
  }
  
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
        default:
          setPlayerButtons(false)
    }},[phase,completedPhase])

    function resetLootHovers() {
      setLootHovers([false,false,false,false,false,false,false,false,false])
    }
    const shotsImages = bulletArray.map((bullet: number, index: number) => {
        return (bullet == 1 && !hidingArray[index] && !deadArray[index]) ? (
          <motion.image
            href={getImage("clip")}
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
            href={"/images/explosion.svg"}
            width={4}
            height={4}
            opacity={0.99}
            initial={{
              rotate: `${calculateAngle(index, targetArray[index]) + 90}deg`, // applied once
              x:getRotationXGun(index,targetArray[index]) + getBulletChangeX(index,targetArray[index]),
              y:getRotationYGun(index,targetArray[index]) + getBulletChangeY(index,targetArray[index]),
              clipPath: "inset(0 100% 0 0)"
            }}
            animate={{ clipPath: "inset(0 0% 0 0)",
              opacity: 1
             }}
            transition={{
              clipPath: {duration: 1},
              opacity: {duration: 2.4}
            }}
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
                        />
                      </g>
    }

    function bulletImage(bulletVal: number) : JSX.Element {
      const bulletHoverFunctions = [setHoverBlank,setHoverBullet];
      const bulletHoverFunction = bulletHoverFunctions[bulletVal];
      const bulletHoverVals = [hoverBlank,hoverBullet];
      const bulletLocationX = [getButtonLocationX2, getButtonLocationX];
      const bulletLocationY = [getButtonLocationY2, getButtonLocationY];
      const bulletImages = [blankImage, getImage("clip")];
      return <g onClick={() => {
                        setBulletChoice(false);
                        bulletHoverFunction(false);
                        setPlayerButtons(true);
                        setAmmo(bulletVal)
                        
                      }} onMouseEnter={() => bulletHoverFunction(true)} 
                          onMouseLeave={() => bulletHoverFunction(false)}>
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
                        />
                      </g>
    }

    function playerImage (name: string, index: number): JSX.Element {
      let sizes = 2;
      let playerSize = 13;
      return <g>
            {deadArray[index] ? 
            (<image 
              href={"/images/skull.svg"} 
              height={9} 
              width={9} 
              x={getX(index)+0.5} 
              y={getY(index)-5}
            />): 
            (
              <motion.image 
              href={"/images/character.svg"} 
              height={hoverIndex==index ? (playerSize+1):(playerSize)} 
              width={hoverIndex==index ? (playerSize+1):(playerSize)} 
              x={hoverIndex==index ? (getX(index)-2):(getX(index)-1.5)} 
              y={hoverIndex==index ? (getY(index)-7):(getY(index)-6.5)}
              opacity={(hidingArray[index] && phase == "LOOTING") ? 0.3: 1}

              animate={
                ((playerButtons) && (!deadArray[index]) && (index!== thisId) && !((phase=="GODFATHERPRIV") && (thisId !== godfatherIndex) && (index === targetArray[thisId])))
                ? {
                  filter: [
                        `
                          drop-shadow(0 0 1px rgba(255, 255, 0, 1))
                          drop-shadow(0 0 2px rgba(255, 255, 0, 0.9))
                          saturate(2)
                        `,
                        `
                          drop-shadow(0 0 0px rgba(255, 255, 0, 1))
                          drop-shadow(0 0 0px rgba(255, 255, 0, 0.9))
                          saturate(2)
                        `,
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
                {duration: 0}
              }
              />
            )}
            
            <text className="text" x={getX(index)+5-(name.length)/2} y={getY(index)-5.5} fontSize={sizes}>{name}</text>
            <image href={heartImage} x={getX(index)+sizes} y={getY(index)+4} height={sizes} width={sizes} opacity={playerHealth[index] > 0 ? 1: 0.4}/>
            <image href={heartImage} x={getX(index)+2*sizes} y={getY(index)+4} height={sizes} width={sizes} opacity={playerHealth[index] > 1 ? 1: 0.4}/>
            <image href={heartImage} x={getX(index)+3*sizes} y={getY(index)+4} height={sizes} width={sizes} opacity={playerHealth[index] > 2 ? 1: 0.4}/>
            {index == godfatherIndex ? 
            (<image href={getImage("godfather")} x={getX(index)+1.5} y={getY(index)+1} height="3" width="3"/>) : null
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
      return <g>
              <rect x={getContainerX(index)} y={getContainerY(index)} width={width} height={height} fill="tan" stroke="black" strokeWidth={0.2}/>
              <rect x={getButtonLocationX(index)-0.5} y={getButtonLocationY(index)-1} width={index < 4 ? 10 : 5} height={index < 4 ? 6 : 12} fill="white" stroke="black" strokeWidth={0.1}></rect>
              <g>
                <rect x={x} y={y-1} width="10" height="5" fill="white" stroke="black" strokeWidth="0.1" opacity={phase !== "GAMBLING" ? 1 : 0.3}></rect>
                <text className="text" x={x+0.1} y={y+0.75} fontSize="2" opacity={phase !== "GAMBLING" ? 1 : 0.3}>${playerArray[index].money}</text>
                <image href={getImage("gem")} x={x+2} y={y+2} height="2" width="2" opacity={phase !== "GAMBLING" ? 1 : 0.3}/>
                <text className="text" x={x+1} y={y+3.5} fontSize="2" opacity={phase !== "GAMBLING" ? 1 : 0.3}>{playerArray[index].gems}</text>
                <image href={getImage("nft")} x={x+8} y={y+1.75} height="2" width="2" opacity={phase !== "GAMBLING" ? 1 : 0.3}/>
                <text className="text" x={x+7} y={y+3.5} fontSize="2" opacity={phase !== "GAMBLING" ? 1 : 0.3}>{playerArray[index].nft}</text>
                {Array.from({length: playerArray[index].bullets}).map((_, i: number) => (
                  <image key={i} href={getImage("clip")} x={x+8.5-i*0.5} y={y-0.9} height="2" width="2" opacity={phase !== "GAMBLING" ? 1 : 0.3}/>
                ))}
              </g>
            </g>
    }
    
    const myGunAndBullet = useMemo(() => {
      const target = targetArray[thisId];
      const index = thisId;
      let bullet : number;
      if (phase === "LOADANDAIM" && ammo != -1) {
        bullet = ammo;
      }
      else {
        bullet = bulletArray[thisId];
      }
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
            href={getImage("clip")}
            width={4}
            height={4}
            initial={{
              rotate: `${calculateAngle(index, targetArray[index]) + 90}deg`, 
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
              rotate: `${calculateAngle(index, targetArray[index]) + 90}deg`, 
              x:getRotationXGun(index,targetArray[index]) + getBulletChangeX(index,targetArray[index]),
              y:getRotationYGun(index,targetArray[index]) + getBulletChangeY(index,targetArray[index]),
            }}

          />
          )}
      </g>
    },[phase, targetArray, bulletArray, gunHoverIndex, ammo])

    const guns = useMemo(() => {
      return targetArray.map((target:number,index:number) => (
        ((!deadArray[index]) && (index !== thisId || phase==="SHOOTING") && (phase != "SHOOTING" || !hidingArray[index])) && (<g key={index}>
          <g onMouseEnter={() => setGunHoverIndex(index)} onMouseLeave={() => setGunHoverIndex(-1)}>
          {flipped(index, target) ? 
          (<image href={gunImageLeft} height="4" width="4" x={getX(index)-4} y={getY(index)} transform={`rotate(${180+calculateAngle(index,target)}, ${getX(index)+5}, ${getY(index)})`} />) :
          (<image href={gunImage} height="4" width="4" x={getX(index)+10} y={getY(index)} transform={`rotate(${calculateAngle(index,target)}, ${getX(index)+5}, ${getY(index)})`} />)
          }
          </g>
          {gunHoverIndex === index ? 
          <line key={index} x1={getRotationXGun(index,target)} x2={getX(target)+5} y1={getRotationYGun(index,target)} y2={getY(target)+0.5} stroke="black" strokeDasharray={"0.1 1"} strokeLinecap="round" strokeWidth={0.2}/>
          : null}
      </g>)))},[targetArray,phase, gunHoverIndex]);

    const lootImages = useMemo(() => {
      return Object.values(lootDict).map((value: Loot, index: number) => 
        value.type !== "empty" ? (
          <motion.g key={index} onClick={lootTurn && phase==="LOOTING" ? (() => {
            itemTaken(index);
            setLootTurn(false);
            resetLootHovers;
            }) : doNothing} 
            onMouseEnter={lootTurn && phase==="LOOTING" ? (() => {
              const newLootHovers=[false,false,false,false,false,false,false,false,false]
              newLootHovers[index] = true;
              setLootHovers(newLootHovers)
            }) : doNothing}
            onMouseLeave={lootTurn && phase==="LOOTING" ? (
              resetLootHovers
            ) : doNothing}
            

              initial={{x:getLootX(index)-1, y:getLootY(index)}}
              opacity={phase === "LOOTING" ? 1 : 0.3}
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
              <rect x={0} y={0} height={4} width={8} stroke={"black"} strokeWidth={0.5} style={{filter: lootTurn && lootHovers[index] ? ("drop-shadow(0 0 1px green)"): "none"}}/>
              <rect x={0} y={0} height={4} width={8} fill={getLootCardColor(value.type)} stroke={getLootCardStrokeColor(value.type)} strokeWidth={0.3}/>
              <rect x={0.1} y={0.1} height={3.8} width={7.8} fill={"transparent"} stroke={"black"} strokeWidth={0.1}/>            
              <circle cx={4} cy={2} r={1.75} fill={getLootCardColor(value.type)} stroke={"black"} strokeWidth={0.1}/>
              <text className={"text"} x={0.25} y={1} fontSize={1} fill={"black"}>{value.value > 0 ? ("$"+value.value/1000+"K") : ""}</text>
              <text className={"text"} x={5.5} y={3.75} fontSize={1} fill={"black"}>{value.value > 0 ? ("$"+value.value/1000+"K") : ""}</text>            
              <image 
                href={getImage(value.type)} 
                height="3" 
                width="4" 
                x={2}
                y={0.5}
              />
          </motion.g>) : null
        )
    },[phase, lootDict, lootTurn, boughtItemIndex, itemAnimation, lootHovers])

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

      const handleSocketDisconnect = () => {
        socket.emit("socketDisconnected",thisId,room)
      }

      const handleItemAnimation = (itemIndex: number) => {
        setBoughtItemIndex(itemIndex);
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

          {phase ==="GAMEOVER" ? null: lootImages}
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
        {((completedPhase && phase==="LOADANDAIM") || phase==="GODFATHERPRIV" || phase=== "GAMBLING") ? myGunAndBullet : null}
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
              case "LOOTING":
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

                  </g>
            }
          })()}
      </g>)}

    </svg>
}

export default Game
