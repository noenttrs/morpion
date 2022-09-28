import { connection } from "websocket"

export enum EventsServer {
    CREATE_TOKEN = "CREATE_TOKEN",
    CREATE_ROOM = "CREATE_ROOM",
    JOIN_ROOM = "JOIN_ROOM",
    MORPION_PLAY = "MORPION_PLAY",
    MORPION_FINISH = "MORPION_FINISH",
}

export interface EventsServerData {
    "CREATE_TOKEN": {
        token: string
    },
    "CREATE_ROOM": {
        inviteCode: string
    },
    "JOIN_ROOM": {
        whoStart: number
    },
    "MORPION_PLAY": {
        board: string[][]
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
        col: number;
        row: number;
    }
}

export interface User {
    token: string;
    id: {
        adress: string;
        port: number;
    };
    c: connection;
    room: string;
}

export interface Game {
    type: "morpion" | "4pow";
    creator: string;
    invite: string | null;
    whoStart: number;
    count: number;
    board: string[][];
}

export interface EventFile {
    eventType: EventsClient;
    event: (c: connection, data: any, token: string, user: User, users: { [code: string]: User }, games: { [code: string]: Game }) => any;
}
