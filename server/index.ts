import express from 'express';
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import cors from "cors";
import {ServerToClientEvents , ClientToServerEvents, Player} from "../typings";
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
interface GameState {
    playerArray: Player[];
}

function newGameState():GameState {
    const playerArray : Player[] = [new Player("tom")]
    return {playerArray}
}

function generateRoomCode(): string {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;

}

const games = new Map<string,GameState>();

io.on("connection", (socket: Socket<ClientToServerEvents,ServerToClientEvents>) => {
    socket.on("clientMsg",(data) => {
        // console.log(data)
        io.sockets.emit("serverMsg",data);
    })

    socket.on("joinRoom",(room: string) => {
        let outRoom = ""
        if (games.has(room)) {
            // do some putting of the players in the array
            socket.join(room);
            outRoom = room;
        }
        socket.emit("enterExistingRoom",outRoom);

    })

    socket.on("createRoom",() => {
        let ableToCreateRoom = false;
        let roomId: string = "";
        for (let i = 0; i < 10000; i++) {
            roomId = generateRoomCode();
            if (!games.has(roomId)) {
                ableToCreateRoom = true;
                break
            }
        }

        if (ableToCreateRoom) {
            socket.join(roomId);
            games.set(roomId,newGameState());
            socket.emit("enterExistingRoom",roomId);
        }
        else {
            socket.emit("unableToCreateRoom");
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