export interface ServerToClientEvents {
    serverMsg: (data : {msg : string; room: string}) => void;
    enterExistingRoom: (room: string) => void;
    unableToCreateRoom: () => void;
    // list all of the server to client events here (so easy goddamn)
}

export interface ClientToServerEvents {
    clientMsg: (data : {msg : string; room: string}) => void;
    createRoom: () => void;
    joinRoom: (room: string) => void;
    // list all of the client to server events here 
}

// export enum Phase {
//     Pregame,
//     Game,
//     Endgame
// }

// export enum RoundPhase {
//     Reset,
//     LoadAndAim,
//     GodfatherPriv,
//     Gambling,
//     Shooting,
//     Looting,
//     RoundEnd
// }

export class Player {
    // Need to add more
    public static id : number = 0;
    public playerId : number;
    public name: string;
    public connected: boolean;

    public constructor(name: string) {
        this.name = name;
        this.playerId = Player.id++;
        this.connected=true;
    }
}