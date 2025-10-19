export interface ServerToClientEvents {
    enterExistingRoom: (room: string, reason: string, id: number) => void;
    unableToCreateRoom: () => void;
    sendPlayerArray: (playerArray: Player[]) => void;
    startGame: () => void;
    getGameState: (gameState: GameState) => void;
    getPlayerNames: (playerArray: Player[]) => void;
    getPlayerIndex: (index: number) => void;
    animateItem: (itemIndex: number, playerIndex: number) => void;
    failedToAccessRoom: () => void;
    changeConnected: (playerArray: Player[]) => void;
    removePlayerFromLobby: (index: number, playerArray: Player[]) => void;
    // list all of the server to client events here (so easy goddamn)
}

export interface ClientToServerEvents {
    createRoom: (playerId: string) => void;
    joinRoom: (room: string, deviceId: string, playerId: string) => void;
    sendName: (name: string, id: number, room: string) => void;
    triggerStartGame: (room: string) => void;
    requestInitialState: (room: string, id: number) => void;
    requestGameState: (room: string) => void;
    sendBulletAndTarget: (bullet: number, targetId: number, id: number, room: string) => void;
    sendGodfatherDecision: (id: number, target: number, room: string) => void;
    sendHidingChoice: (id: number, choice: boolean, room : string) => void;
    addItemToPlayer: (itemIndex: number, playerIndex: number, room:string) => void;
    continueToGambling: (room: string) => void;
    joinPlayerArray: (room:string, deviceId: string, playerId: string) => void;
    socketDisconnected: (id: number, room: string) => void;
    itemAnimationComplete: (itemIndex: number, playerIndex: number, room: string) => void;
    requestRemovePlayer: (room: string, index: number) => void;
    // list all of the client to server events here 
}


export interface GameState {
    /** An array that holds all Player objects in the game */
    playerArray: Player[];
    /** True if the game is in the lobby and not full */
    joinable: boolean;
    /** The phase of the game currently in. Uses type Phase */
    phase: Phase;
    /** Counts the number of people who have completed their action in phases were all players need an action */
    counter: number;
    /** The total number of players alive */
    totalAlivePlayers: number;
    /** The index of the boss within playerArray */
    bossId: number;
    /** The number of bullets that have been used, necessary for clip loot items */
    discardedBullets: number;
    /** The remaining deck of loot items in the game */
    lootDeck: Loot[];
    /** The dictionary of loot items for the round */
    lootDict: Record<number,Loot>;
    /** An array of player indices who will lot this round */
    lootPlayers: number[];
    /** The index of the player who is currently looting */
    lootTurnPlayerIndex: number;
    /** The current round number */
    round: number;
    /** True if the shooting animation is occurring, else false */
    shooting: boolean;
    /** Array of player objects who have won */
    winners: Player[];
    /** Array of sockets currently in the game. Necessary for when rooms have been left */
    sockets: string[];
    /** True if the game has started */
    started: boolean;
}


export type Phase = "LOADANDAIM" | "GODFATHERPRIV" | "GAMBLING" | "SHOOTING" | "LOOTING" | "GAMEOVER";


export class Player {
    public deviceId: string;
    public internalId: string;
    public name: string = "";
    public connected: boolean;
    public blanks = 5;
    public bullets = 3;
    public pendingHits = 0;
    public health = 3;
    public dead = false;
    public target = -1;
    public bulletChoice = -1;
    public hiding = false;
    public choosingLoot = false;
    public damaged = false;
    public money = 0;
    public nft = 0;
    public gems = 0;

    public completedPhase = false;
    public totalScore = 0;



    public constructor(name: string, deviceIdIn: string, idIn: string) {
        this.name = name;
        this.deviceId = deviceIdIn
        this.internalId = idIn;
        this.connected=true;
    }
}


export type LootType = "nft" | "gem" | "cash" | "medkit" | "clip" | "godfather" | "empty";

export class Loot {
    public type: LootType;
    public value = 0;

    public constructor (typeVal: LootType, cashVal: number = 0) {
        this.type = typeVal;
        this.value = cashVal;
    }
}