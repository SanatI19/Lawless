import express from 'express';
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import cors from "cors";
import {ServerToClientEvents , ClientToServerEvents, Player, Phase} from "../shared";
const app = express()
app.use(cors());
const server = createServer(app)
const io = new Server<ClientToServerEvents,ServerToClientEvents>(server, {
    cors: {
        origin: ["http://localhost:5173","https://admin.socket.io"],
        methods: ["GET","POST"],
        credentials: true
    }

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

const roomCodeLength = 5;
const maxPlayers = 8;

interface GameState {
    playerArray: Player[];
    joinable: boolean;
    phase: Phase;
    counter: number;
    totalPlayers: number;
}

function newGameState():GameState {
    const playerArray : Player[] = [new Player("Player1")]
    let joinable = true;
    let phaseVal = Phase.Reset
    return {playerArray, joinable,phase: phaseVal,counter:0,totalPlayers: 0};
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

const games : Record<string,GameState> = {};

io.on("connection", (socket: Socket<ClientToServerEvents,ServerToClientEvents>) => {
    socket.on("clientMsg",(data) => {
        // console.log(data)
        io.sockets.emit("serverMsg",data);
    })

    socket.on("joinRoom",(room: string) => {
        let outRoom = ""
        if (games[room] !== undefined && games[room].joinable) {
            // do some putting of the players in the array
            socket.join(room);
            const playerArray = games[room].playerArray;
            const index = playerArray.length;
            const string = "Player" + (index+1);
            playerArray.push(new Player(string))
            playerArray[index].playerId = index;
            outRoom = room;
        }
        socket.emit("enterExistingRoom",outRoom);

    })

    socket.on("createRoom",() => {
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
            games[roomId] = newGameState();
            if (games)
            socket.emit("enterExistingRoom",roomId);
        }
        else {
            socket.emit("unableToCreateRoom");
        }
    })

    socket.on("requestPlayerArray",(room: string) => {
        socket.emit("sendPlayerArray",games[room].playerArray)
    })

    socket.on("sendName",(name: string, id: number, room: string) => {
        games[room].playerArray[id].name = name;
        socket.broadcast.to(room).emit("sendPlayerArray",games[room].playerArray);
    })

    socket.on("triggerStartGame",(room: string) => {
        games[room].joinable = false;
        games[room].totalPlayers = games[room].playerArray.length;
        io.to(room).emit("startGame");
    })

    socket.on("requestPlayersAndPhase",(room: string) => {
        socket.emit("sendPlayersAndPhase",games[room].playerArray,games[room].phase);
    })

    socket.on("sendBulletAndTarget", (bullet: number, targetId: number, id: number, room: string) => {
        const playerArray = games[room].playerArray;
        if (bullet == 0) {
            playerArray[id].blanks--;
        }
        else {
            playerArray[id].bullets--;
            playerArray[targetId].pendingHits++;
        }
        games[room].counter++;
        if (games[room].counter == games[room].totalPlayers) {
            games[room].counter = 0;
            io.to(room).emit("sendPlayersAndPhase",playerArray,games[room].phase)
        }
    })
    // console.log(socket.id)
    // socket.on("nameEntered",(name) => {
    //     if (playerArray.length>maxPlayers) {
    //         // checkName(name)
    //     }
    // })


    //socket.recovered to help with temporary disconnection
    //socket.rooms can help with separate games (create room button)
    //socket.join .leave to join a room
    // use socket.timeout(x).emit to make a wait time
    // console.log(socket.handshake);
    // console.log(`Client: ${socket.client}`);

    // const player = new Types.Player("name")
    // console.log(Types.Player.id)

//     socket.on("buttonClick", () => {
//         console.log("Button clicked")
//         socket.emit("handleButton");
//     });

//     socket.on("bulletChoice",(bullet: boolean, target: number, id: number) => {
//         // remove bullet from the player id
//         // add damage to target
//         // MORE
//         //iterate doneCounter
//         // io.emit("goToPhase",phase,round)   
//     })

//     socket.on("godFatherPriv",(choice: number) => {
//         // do some action (set player attributes)
//         //iterate doneCounter
//         // io.emit("triggerReaim",player)   
//     })

//     socket.on("gamblingChoice",(choice: boolean, id: number) => {
//         // do some action (set player attributes)
//         //iterate doneCounter
//         // io.emit("goToPhase",phase,round)   
//     })

//     socket.on("lootChoice",(choice: boolean, id: number) => {
//         // do some action (set player attributes)
//         //iterate doneCounter
//         // io.emit("goToPhase",phase,round)   
//     })
//     //socket.emit("godFatherPriv",choice)
//     //socket.emit("gamblingChoice",choice,id)
// //socket.emit("lootChoice",choice,id)


//     // NEED TO DETERMINE IF THERE IS A BETTER WAY TO HAVE FUNCTIONS HERE
//     function sendRoundAll(round: number) {
//         io.emit("getRound",round)
//     }
//     function sendPhase(phase: number) {
//         io.emit("getPhase",phase)
//     }
//         function sendRoundOne(round: number) {
//         socket.emit("getRound",round)
//     }
//     function sendPhaseOne(phase: number) {
//         socket.emit("getPhase",phase)
//     }
    
})

instrument(io, {
  auth: false
});

server.listen(3000)

// app.listen(3000, () => {
//     console.log("Server started")
// })