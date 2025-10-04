export interface ServerToClientEvents {
    serverMsg: (data : {msg : string; room: string}) => void;
    enterExistingRoom: (room: string) => void;
    unableToCreateRoom: () => void;
    sendPlayerArray: (playerArray: Player[]) => void;
    startGame: () => void;
    sendPhase: (phase: Phase) => void;
    sendPlayersAndPhase: (playerArray: Player[], phase: Phase, changes : string[]) => void;
    sendLootDict: (lootDict: Record<number, Loot>) => void;
    sendGodfatherIndex: (index: number) => void;
    sendLootPlayerTurn: (index: number) => void;
    getGameState: (gameState: GameState) => void;
    getPlayerNames: (playerArray: Player[]) => void;
    getPlayerIndex: (index: number) => void;
    animateItem: (itemIndex: number, playerIndex: number) => void;
    // list all of the server to client events here (so easy goddamn)
}

export interface ClientToServerEvents {
    clientMsg: (data : {msg : string; room: string}) => void;
    createRoom: (playerId: string) => void;
    joinRoom: (room: string, playerId: string) => void;
    requestPlayerArray: (room: string) => void;
    sendName: (name: string, id: number, room: string) => void;
    triggerStartGame: (room: string) => void;
    requestInitialState: (room: string) => void;
    requestGameState: (room: string) => void;
    sendBulletAndTarget: (bullet: number, targetId: number, id: number, room: string) => void;
    sendGodfatherDecision: (id: number, target: number, room: string) => void;
    sendHidingChoice: (id: number, choice: boolean, room : string) => void;
    requestLootDict: (room: string) => void;
    addItemToPlayer: (itemIndex: number, playerIndex: number, room:string) => void;
    continueToGambling: (room: string) => void;
    joinPlayerArray: (room:string, playerId: string) => void;
    socketDisconnected: (id: number, room: string) => void;
    itemAnimationComplete: (itemIndex: number, playerIndex: number, room: string) => void;
    shotsFiredComplete: (room: string) => void;
    // list all of the client to server events here 
}


export interface GameState {
    playerArray: Player[];
    joinable: boolean;
    phase: Phase;
    counter: number;
    totalAlivePlayers: number;
    bossId: number;
    discardedBullets: number;
    lootDeck: Loot[];
    lootDict: Record<number,Loot>;
    lootPlayers: number[];
    lootTurnPlayerIndex: number;
    round: number;
    shooting: boolean;
    winners: Player[];
}

export enum Phase {
    // Reset="RESET",
    LoadAndAim="LOADANDAIM",
    GodfatherPriv="GODFATHERPRIV",
    Gambling="GAMBLING",
    Shooting="SHOOTING",
    Looting="LOOTING",
    // RoundEnd="ROUNDEND"
    GameOver="GAMEOVER",
}

export class Player {
    // Need to add more
    public id : number = 0;

    public internalId: string;
    // public playerId : number = 0;
    public name: string = "";
    public connected: boolean;
    public blanks = 5;
    public bullets = 3;
    public pendingHits = 0;
    public health = 3;
    public dead = false;
    //target of a bullet
    public target = -1;
    public bulletChoice = -1;
    // public godfather = false;
    public hiding = false;
    public choosingLoot = false;
    public damaged = false;
    // public damaged = false;
    // loot things
    public money = 0;
    public nft = 0;
    public gems = 0;

    public completedPhase = false;
    public totalScore = 0;


    // public index: number = 0;

    public constructor(name: string, idIn: string) {
        this.name = name;
        this.internalId = idIn;
        this.connected=true;
    }
}

export enum LootType {
    nft,
    gem,
    cash,
    medKit,
    clip,
    godfather,
    empty
}

export class Loot {
    public type: LootType;
    public value = 0;

    public constructor (typeVal: LootType, cashVal: number = 0) {
        this.type = typeVal;
        this.value = cashVal;
    }
}
// export const __forceRuntime = true;