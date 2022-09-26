import { connection } from "websocket"

export type EventsServer = "JOIN_ROOM" | "MORPION_PLAY" | "MORPION_FINISH"

export interface EventsServerData {
    "JOIN_ROOM": {
        whoStart: number
    },
    "MORPION_PLAY": {
        case: `${number}|${number}`
    },
    "MORPION_FINISH": {
        whoWin: number
    }
}

export type EventsClient = "CREATE_ROOM" | "JOIN_ROOM" | "MORPION_PLAY"

export interface EventClientData {
    "CREATE_ROOM": {
        game: "morpion" | "4pow"
    },
    "JOIN_ROOM": {
        inviteCode: string
    },
    "MORPION_PLAY": {
        case: `${number}|${number}`;
    }
}

export interface User {
    token: string;
    id: {
        adress: string;
        port: number;
    }
    room: string
}

export interface Game {
    type: "morpion" | "4pow";
    creator: string;
    invite: string | null;
    whoStart: number;
    board: string[][];
}

export interface EventFile {
    eventType: EventsClient;
    event: (c: connection, data, token: string, user: User, users: { [code: string]: User }, games: { [code: string]: Game }) => any;
}
