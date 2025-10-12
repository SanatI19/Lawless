import express from 'express';
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import cors from "cors";
import {ServerToClientEvents , ClientToServerEvents, Player, GameState, Phase, Loot, LootType} from "../shared";
import path from "path";
import { fileURLToPath } from "url";

// Needed if you’re using ES modules instead of CommonJS
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express()
app.use(cors());

// const staticPath = path.join(__dirname, "../client/dist")
// console.log(staticPath)

app.use(express.static(path.join(__dirname, "../../../client/dist"))); 
// ^ adjust "dist" → "build" if that's what your React build generates

// 🔹 Catch-all route to serve index.html (so React Router works)
// if (process.env.NODE_ENV === "production") {
app.get("/*path", (req, res) => {
res.sendFile(path.join(__dirname, "../../../client/dist/index.html"));
});
// }

const server = createServer(app)
const io = new Server<ClientToServerEvents,ServerToClientEvents>(server, {
    cors: {
        origin: ["http://localhost:5173","https://admin.socket.io"],
        methods: ["GET","POST"],
        credentials: true
    }

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server listening on port " + (process.env.PORT || 3000));
});

//socket.on is listener
//socket.emit("name", data(stuff that is sent))
//socket.on("sameName",what to do (function, etc))
//socket.emit is sender
//io.emit is full sender?

// //Add all necessary parameters here
// const waitTime = 500; // wait time from when final player does something and io emitted
// const playerArray: Types.Player[] = []
// const maxPlayers = 8;
// let doneCounter = 0; // keeps track of number of people who are done at each point
// //need to determine device id or a unique identifier

//CAN HAVE SIMPLE FUNCTION WHICH TAKES DEVICE ID AND TRANSFORMS IT TO AN INTEGER FOR EASIER HANDLING

const roomCodeLength = 4;
const maxPlayers = 8;
const ROOM_TIMEOUT= 5*1000;

// function resetRoomTimeout(room: string) {
//   if (!room) return;
//   clearTimeout(games[room].timeout);
//   games[room].timeout = setTimeout(() => deleteRoom(room), ROOM_TIMEOUT);
// }

// function deleteRoom(room: string) {
//   if (games[room]) clearTimeout(games[room].timeout);
//   delete games[room];
// }


function randomizeArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
    return array;
}

function createNewRandomizedLootDeck(): Loot[] {
    const lootCards: Loot[] = [];
    for (let i = 0; i < 64; i++) {
        if (i < 15) {
            lootCards.push(new Loot("cash",5000));
        }
        else if (i < 30) {
            lootCards.push(new Loot("cash",10000));
        }
        else if (i < 40) {
            lootCards.push(new Loot("cash",10000));
        }
        else if (i < 50) {
            lootCards.push(new Loot("nft"));
        }
        else if (i < 55) {
            lootCards.push(new Loot("gem",1000));
        }
        else if (i < 58) {
            lootCards.push(new Loot("gem",5000));
        }
        else if (i < 59) {
            lootCards.push(new Loot("gem",10000));
        }
        else if (i < 62) {
            lootCards.push(new Loot("clip"));
        }
        else {
            lootCards.push(new Loot("medkit"));
        }
    }
    return randomizeArray(lootCards);
}


function newGameState(playerId: string, roomId : string):GameState {
    const playerArray : Player[] = []
    let joinable = true;
    // let phaseVal = "LOADANDAIM";
    const lootVals: Loot[] = createNewRandomizedLootDeck();
    return {playerArray, joinable, phase: "LOADANDAIM",counter:0,totalAlivePlayers: 0, bossId: 0, discardedBullets: 0, lootDeck: lootVals,lootDict: {},lootPlayers: [], lootTurnPlayerIndex: 0, round: 0, shooting: false, winners: [], sockets: [], started: false};
}

function chooseGodfather(totalPlayers : number) {
    return Math.floor(Math.random() * totalPlayers);
}

function generateRoomCode(): string {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < roomCodeLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;

}

function setAllUncompleted(playerArray: Player[]): void {
    for (const player of playerArray) {
        player.completedPhase = false;
    }
}

function getLootDict(lootCards: Loot[]): Record<number,Loot> {
    const lootDict : Record<number,Loot> = {};
    lootDict[0] = new Loot("godfather");
    for (let i = 0; i < 8; i++) {
        const card = lootCards.pop();
        if (card !== undefined) {
            lootDict[i+1] = card;
        }
    }
    return lootDict;
}

function setAllUndamaged(playerArray: Player[]) : void {
    for (const player of playerArray) {
        player.damaged = false;
    }
}

function setAllUnhidden(playerArray: Player[]) : void {
    for (const player of playerArray) {
        player.hiding = false;
    }
}

function setGodfatherIncomplete(playerArray: Player[],room: string): void {
    for (let i = 0; i < playerArray.length; i++) {
        const player = playerArray[i]
        if (i == games[room].bossId) {
            player.completedPhase = false;
        }
    }
}

function setInitialLooter(array: number[], godfather: number) {
    if (array.includes(godfather)) {
        return godfather;
    }
    else {
        return findNextValueInit(array,godfather);
    }
}

function findNextValueInit(array: number[], value: number) {
    let next = false;
    let val = -1
    let firstIncluded = -1;
    for (const x of lootOrder) {
        if (next && array.includes(x)) {
            return x
            // break;
        }
        else {
            if (array.includes(x)) {
                if (firstIncluded == -1) {
                    firstIncluded = x;
                }
            }
            if (x == value) {
                next = true;
            }
        }
    }
    return firstIncluded;
}

function findNextValue(array: number[], value: number ) {
    let out = array[0];
    const index = array.indexOf(value);
    if (index + 1 < array.length) out = array[index+1];
    // let next = false;
    // for (const x of array) {
    //     if (x == value) {
    //         next = true;
    //         // continu
    //     }
    // }
    return out;
}

function stashItemOnPlayer(player: Player,playerIndex: number, item: Loot, room: string): void {
    player.money += item.value;
    if (item.type == "clip") {
        if ((games[room].discardedBullets > 0) && (player.blanks > 0)) {
            player.bullets++;
            games[room].discardedBullets--;
            player.blanks--;
            // maybe doing the thing where they get rid of a blank, no reason not to, i think it should be automatic
        }
    }
    else if (item.type == "gem") {
        player.gems++;
    }
    else if (item.type == "nft") {
        player.nft++;
    }
    else if (item.type == "godfather") {
        games[room].bossId = playerIndex;
    } 
    else if (item.type == "medkit") {
        player.health = 3;
    }
}

function makeAllPlayersIncomplete(playerArray: Player[]): void {
    for (const player of playerArray) {
        player.completedPhase = false;
    }
}

// const lootOrder = [0,7,5,3,1,6,4,2]
const lootOrder = [0,2,4,6,1,3,5,7]

// function mapIndices(num : number) : number {
//     let out = 0;
//     if (num == 7) {
//         out = 1;
//     }
//     else if (num == 5) {
//         out = 2;
//     }
//     else if (num == 3) {
//         out = 3;
//     }
//     else if (num == 1) {
//         out = 4;
//     }
//     else if (num == 6) {
//         out = 5;
//     }
//     else if (num == 4) {
//         out = 6;
//     }
//     else if (num == 2) {
//         out = 7;
//     }
//     return out
// }
function orderLooters(looters: number[]): number[] {
    const out : number[] = []
    for (const val of looters) {
        out[lootOrder.indexOf(val)] = val;
    }
    
    const realOut =  out.filter((val): val is number => val != null)
    return realOut

}


function totalNft(num: number) : number {
    // let val : number;
    switch (num) {
        case (1): 
            return 1000;
        case (2):
            return 4000;
        case (3):
            return 30000;
        case (4):
            return 60000;
        case (5):
            return 100000;
        case (6):
            return 150000;
        case (7):
            return 200000;
        case (8):
            return 300000;
        case (9):
            return 400000;
        case (10):
            return 500000;
        default:
            return 0;
    }

}

const games : Record<string,GameState> = {};
const socketToRoom : Record<string,string> = {};

io.on("connection", (socket: Socket<ClientToServerEvents,ServerToClientEvents>) => {
    socket.on("clientMsg",(data) => {
        io.sockets.emit("serverMsg",data);
    })

    socket.on("joinRoom",(room: string, deviceId: string, playerId: string) => {
        let outRoom = "";
        let reason = "";
        let id = -1;
        if (games[room] !== undefined && games[room].joinable) {
            // do some putting of the players in the array
            socket.join(room);
            socketToRoom[socket.id] = room;
            outRoom = room;
        }
        if (games[room] === undefined) {
            reason = "Room does not exist";
        }
        else if (!games[room].joinable) {
            reason = "Room is not joinable";
            for (let i = 0; i < games[room].playerArray.length; i++) {
                const player = games[room].playerArray[i];
                if (!player.connected && (player.deviceId == deviceId)) {
                    if (games[room].started) {
                        reason = "join"
                    }
                    else {
                        reason = "rejoin"
                    }
                    outRoom = room;
                    id = i;
                    break
                }
            }
        }
        socket.emit("enterExistingRoom",outRoom, reason, id);

    })

    socket.on("createRoom",(playerId: string) => {
        let ableToCreateRoom = false;
        let roomId: string = "";
        for (let i = 0; i < 10000; i++) {
            roomId = generateRoomCode();
            if (games[roomId] === undefined) {
                ableToCreateRoom = true;
                break
            }
        }

        if (ableToCreateRoom) {
            socket.join(roomId);
            socketToRoom[socket.id] = roomId;
            games[roomId] = newGameState(playerId, roomId);
            games[roomId].sockets.push(socket.id);
            // if (games)
            socket.emit("enterExistingRoom",roomId,"", -1);
        }
        else {
            socket.emit("unableToCreateRoom");
        }
    })

    socket.on("requestRoom", (room: string) => {
        if (games[room] === undefined) {
            socket.emit("failedToAccessRoom");
        }
    })

    socket.on("requestPlayerArray",(room: string) => {
        socket.emit("sendPlayerArray",games[room].playerArray)
    })


    socket.on("joinPlayerArray",(room: string, deviceId: string, playerId: string) => {
        if (games[room] === undefined) {
            socket.emit("failedToAccessRoom")
        }
        else {
        socket.join(room)
        socketToRoom[socket.id] = room;

        const playerArray = games[room].playerArray;
        const playerIds = playerArray.map(player => player.internalId);
        const deviceIds = playerArray.map(player => player.deviceId);
        let index = 0;
        if (playerIds.includes(playerId)) {
            index = playerIds.indexOf(playerId)
            games[room].sockets[index] = socket.id;
            socket.emit("getPlayerIndex",index);
            socket.emit("sendPlayerArray",playerArray);
            if (!games[room].playerArray[index].connected) {
                games[room].playerArray[index].connected = true;
                io.to(room).emit("changeConnected",games[room].playerArray);
            }
        }
        // add else if here to handle when the playerArray is joined but not 
        else {
            let rejoin = false;
            for (let i = 0; i < games[room].playerArray.length; i++) {
                const player = games[room].playerArray[i];
                if (!player.connected && (player.deviceId == deviceId)) {
                    rejoin = true;
                    index = i;
                    player.internalId = playerId;
                    break
                }
            }

            if (rejoin) {
                socket.emit("getPlayerIndex",index);
                socket.emit("sendPlayerArray",playerArray);
                games[room].sockets[index] = socket.id;
                if (!games[room].playerArray[index].connected) {
                    games[room].playerArray[index].connected = true;
                    io.to(room).emit("changeConnected",games[room].playerArray);
                }
            }
            else {
                index = playerArray.length;
                const name = "Player" + (index+1);
                playerArray.push(new Player(name,deviceId, playerId))
                playerArray[index].id = index;
                games[room].sockets[index] = socket.id;
                socket.emit("getPlayerIndex",index);
                io.to(room).emit("sendPlayerArray",playerArray);
            }
        }
        if (playerArray.length == 8) {
            games[room].joinable = false;
            // need to add something to fix potential race condition
        }
        }
    })


    socket.on("sendName",(name: string, id: number, room: string) => {
        games[room].playerArray[id].name = name;
        io.to(room).emit("sendPlayerArray",games[room].playerArray);
    })

    socket.on("triggerStartGame",(room: string) => {
        games[room].started = true;
        games[room].joinable = false;
        games[room].totalAlivePlayers = games[room].playerArray.length;
        games[room].lootTurnPlayerIndex = -1
        // games[room].playerArray[chooseGodfather(games[room].totalAlivePlayers)].godfather = true;
        games[room].bossId = chooseGodfather(games[room].totalAlivePlayers);
        games[room].lootDict = getLootDict(games[room].lootDeck);
        io.to(room).emit("startGame");
    })

    socket.on("requestInitialState",(room: string, id: number) => {
        if (games[room] !== undefined) {  
            socket.join(room);
            socketToRoom[socket.id] = room;
            games[room].sockets[id] = socket.id;
            if (!games[room].playerArray[id].connected) {
                games[room].playerArray[id].connected = true;
                io.to(room).emit("changeConnected",games[room].playerArray);
            }
            socket.emit("getPlayerNames",games[room].playerArray);
            socket.emit("getGameState",games[room]);
        }
        else {
            socket.emit("failedToAccessRoom");
        }
        // socket.emit("sendPlayersAndPhase",games[room].playerArray,games[room].phase,["INIT"]);
        // socket.emit("sendGodfatherIndex",games[room].bossId);
        // socket.emit("sendLootPlayerTurn",games[room].lootTurnPlayerIndex);
    })

    socket.on("requestGameState", (room: string) => {
        if (games[room] === undefined) {
            socket.emit("failedToAccessRoom");
        }
        else {
            socket.emit("getGameState", games[room]);
        }
    })

    socket.on("sendBulletAndTarget", (bullet: number, targetId: number, id: number, room: string) => {
        const playerArray = games[room].playerArray;
        playerArray[id].target = targetId;
        playerArray[id].completedPhase = true;
        playerArray[id].bulletChoice = bullet;
        if (games[room].phase == "LOADANDAIM") {
            if (bullet == 0) {
                playerArray[id].blanks--;
            }
            else {
                playerArray[id].bullets--;
                // playerArray[targetId].pendingHits++;
                games[room].discardedBullets++;
            }
            games[room].counter++;
            if (games[room].counter == games[room].totalAlivePlayers) {
                games[room].counter = 0;
                games[room].phase="GODFATHERPRIV";
                setGodfatherIncomplete(playerArray,room);
                io.to(room).emit("getGameState",games[room]);
            }
        }
        else if (games[room].phase == "GODFATHERPRIV") {
            // playerArray[targetId].pendingHits += bullet; // check this out to make sure nothing crazy is going on
            games[room].phase="GAMBLING";
            setAllUncompleted(playerArray);
            // io.to(room).emit("sendPlayersAndPhase",playerArray,games[room].phase,["target","player"])
            io.to(room).emit("getGameState",games[room]);
        }
    })

    socket.on("sendGodfatherDecision",(id: number, target: number, room: string) => {
        const playerArray = games[room].playerArray;
        playerArray[id].completedPhase = true;
        playerArray[target].completedPhase = false;
        // playerArray[playerArray[target].target].pendingHits -= playerArray[target].bulletChoice;
        // io.to(room).emit("sendPlayersAndPhase",playerArray,games[room].phase,["player"])
        io.to(room).emit("getGameState",games[room]);
    })

    socket.on("continueToGambling", (room: string) => {
        games[room].phase = "GAMBLING";
        setAllUncompleted(games[room].playerArray)
        games[room].playerArray[games[room].bossId]; // UPDATE
        io.to(room).emit("getGameState",games[room]);
    })

    socket.on("sendHidingChoice",(id: number, choice: boolean, room:string) => {
        const playerArray = games[room].playerArray;
        playerArray[id].completedPhase = true;
        playerArray[id].hiding = choice;
        games[room].counter++
        if (games[room].counter == games[room].totalAlivePlayers) {
            games[room].counter = 0;
            // games[room].phase=Phase.Looting;
            const looters: number[] = []
            for (const player of playerArray) {
                if (!player.hiding && !player.dead) {
                    playerArray[player.target].pendingHits += player.bulletChoice;
                }
            }
            for (let i = 0; i<playerArray.length; i++){
                const player = playerArray[i]
                if (!player.dead) {
                    if (player.hiding) {
                        player.pendingHits = 0;
                    }
                    else {
                        player.health -= player.pendingHits;
                        if (player.pendingHits == 0 && !player.dead) {
                            looters.push(i)
                            player.completedPhase = false;
                        }
                        else {
                            player.damaged = true;
                        }
                        if (player.health <= 0) {
                            player.dead = true;
                            games[room].totalAlivePlayers--;
                        }
                        player.pendingHits = 0;
                    }
                }
            }
            if (games[room].totalAlivePlayers < 2) {
                endGame(room);
            }
            else {
            // setAllUncompleted(playerArray);
            // const lootDict = getLootDict(games[room].lootDeck);
            const organizedLooters = orderLooters(looters);
            games[room].lootPlayers = organizedLooters;
            // games[room].lootDict = lootDict;
            games[room].lootTurnPlayerIndex = setInitialLooter(looters,games[room].bossId);
            // CHANGE THIS TO JUST A PHASE CHANGE AND AN INFO THING
            // games[room].phase = Phase.Shooting;
            games[room].phase = "SHOOTING";
            games[room].shooting = true;
            io.to(room).emit("getGameState",games[room])
            games[room].phase = "LOOTING";
            games[room].shooting = false;
            if (games[room].lootPlayers.length == 0) {
                resetToRoundStart(room)
            }
            }
        }

    })

    // socket.on("shotsFiredComplete", (room: string) => {
    //     games[room].phase = Phase.Looting;
    //     // games[room].lootTurnPlayerIndex = setInitialLooter(looters,games[room].bossId);

    //     if (games[room].lootPlayers.length == 0) {
    //         resetToRoundStart(room)
            
    //         // io.to(room).emit("sendPlayersAndPhase",games[room].playerArray,games[room].phase,["INIT"])
    //     }
    //     else {
    //         io.to(room).emit("getGameState",games[room]);
    //     }
    // })

    //THIS NEEDS TO BE REMOVED
    socket.on("requestLootDict",(room: string) => {
        socket.emit("sendLootDict",games[room].lootDict);
    })

    socket.on("addItemToPlayer",(itemIndex: number, playerIndex: number, room: string) => {
        const player = games[room].playerArray[playerIndex];
        const item = games[room].lootDict[itemIndex];
        stashItemOnPlayer(player,playerIndex,item,room);
        io.to(room).emit("animateItem", itemIndex, playerIndex);
    })

    socket.on("itemAnimationComplete", (itemIndex: number,playerIndex : number, room: string) => {
        games[room].lootDict[itemIndex] = new Loot("empty");
        games[room].counter++;
        if (games[room].counter >= 9) {
            games[room].counter = 0;
            if (games[room].round >= 7) {
                endGame(room);
            }
            else {
                resetToRoundStart(room);
                io.to(room).emit("getGameState", games[room])
            }
        }
        else {
            games[room].lootTurnPlayerIndex = findNextValue(games[room].lootPlayers,playerIndex);
            io.to(room).emit("getGameState",games[room]);
        }
    })

    socket.on("disconnect", (reason) => {
        const roomId = socketToRoom[socket.id];
        if (roomId !== undefined && games[roomId] !== undefined) {
            const index = games[roomId].sockets.indexOf(socket.id);
            if (index !== -1) {
                games[roomId].playerArray[index].connected = false;
                io.to(roomId).emit("changeConnected",games[roomId].playerArray);
            }
        }
    })

    socket.on("socketDisconnected",(id:number, room: string) => {
        if (games[room] !== undefined) {
            games[room].playerArray[id].connected = false;
        }
    })

    function endGame(room: string) {
        // const totalScores: number[]= [];
        const playerArray = games[room].playerArray;
        const alivePlayers : Player[]= []

        for (const player of playerArray) {
            if (!player.dead) {
                alivePlayers.push(player)
            }
            else {
                player.money = 0;
            }
        }
        
        const gems = alivePlayers.map(player => player.gems);
        const maxGems = Math.max(...gems);
        let noGems = false;

        gems.splice(gems.indexOf(maxGems),1);
        if (gems.includes(maxGems)) noGems = true;

        for (const player of alivePlayers) {
            let val = player.money;
            if (!noGems && player.gems == maxGems) {
                val += 60000;
            }
            val += totalNft(player.nft);

            player.totalScore = val;
        }

        const maxScore = Math.max(...alivePlayers.map(player => player.totalScore))

        const winners : Player[] = [];
        for (const player of alivePlayers) {
            if (player.totalScore == maxScore) {
                winners.push(player);
            }
        }

        const minHealth = Math.min(...winners.map(player => player.health));
        const finalWinners : Player[] = []
        for (const player of winners) {
            if (player.health == minHealth) {
                // games[room].winners
                finalWinners.push(player)
            }
        }
        games[room].winners = finalWinners;
        games[room].phase = "GAMEOVER";
        io.to(room).emit("getGameState",games[room]);

    }

    function resetToRoundStart(room: string) {
        games[room].round++;
        if (games[room].round >= 9) {
            endGame(room);
        }
        else {
        games[room].lootDict = getLootDict(games[room].lootDeck);
        games[room].lootTurnPlayerIndex = -1
        games[room].phase = "LOADANDAIM";
        setAllUncompleted(games[room].playerArray);
        setAllUndamaged(games[room].playerArray);
        setAllUnhidden(games[room].playerArray);
        }
    }
    
})

instrument(io, {
  auth: false
});