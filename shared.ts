export interface ServerToClientEvents {
    serverMsg: (data : {msg : string; room: string}) => void;
    enterExistingRoom: (room: string) => void;
    unableToCreateRoom: () => void;
    sendPlayerArray: (playerArray: Player[]) => void;
    startGame: () => void;
    sendPhase: (phase: Phase) => void;
    sendPlayersAndPhase: (playerArray: Player[], phase: Phase) => void;
    // list all of the server to client events here (so easy goddamn)
}

export interface ClientToServerEvents {
    clientMsg: (data : {msg : string; room: string}) => void;
    createRoom: () => void;
    joinRoom: (room: string) => void;
    requestPlayerArray: (room: string) => void;
    sendName: (name: string, id: number, room: string) => void;
    triggerStartGame: (room: string) => void;
    requestPlayersAndPhase: (room: string) => void;
    sendBulletAndTarget: (bullet: number, targetId: number, id: number, room: string) => void;
    // list all of the client to server events here 
}

export enum Phase {
    Reset="RESET",
    LoadAndAim="LOADANDAIM",
    GodfatherPriv="GODFATHERPRIV",
    Gambling="GAMBLING",
    Shooting="SHOOTING",
    Looting="LOOTING",
    RoundEnd="ROUNDEND"
}

export class Player {
    // Need to add more
    public static id : number = 0;
    public playerId : number = 0;
    public name: string;
    public connected: boolean;
    public blanks = 5;
    public bullets = 3;
    public pendingHits = 0;
    // public index: number = 0;

    public constructor(name: string) {
        this.name = name;
        this.connected=true;
    }
}

export const __forceRuntime = true;