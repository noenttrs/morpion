"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const websocket_1 = require("websocket");
const fs_1 = require("fs");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const ws = new websocket_1.server({
    httpServer: server,
    autoAcceptConnections: true
});
let events = {};
(0, fs_1.readdirSync)("./server/out/Events/")
    .filter((x) => x.endsWith(".js"))
    .forEach((file) => {
    let { eventType, event } = require(`./Events/${file}`).event;
    events[eventType] = event;
});
let users = {};
let closeRef = {};
let games = {};
app.get("/room", (req, res) => {
    let id = req.query.id;
    if (id === undefined)
        return res.send({
            error: "No id",
            roomExist: false
        });
    if (games[id] === undefined || games[id].invite === null)
        return res.send({
            error: "This room doesn't exist",
            roomExist: false
        });
    return res.send({
        roomExist: true
    });
});
ws.on("connect", (c) => {
    let token = (Date.now() +
        +([...Array(10)].map(() => Math.floor(Math.random() * 10)).join(""))).toString(16);
    users[token] = {
        id: {
            adress: c.socket.remoteAddress,
            port: c.socket.remotePort
        },
        c: c,
        room: null
    };
    closeRef[`${c.socket.remoteAddress}:${c.socket.remotePort}`] = token;
    c.send(JSON.stringify({
        event: "CREATE_TOKEN",
        data: {
            token: token
        }
    }));
    console.log(`New connection : token : ${token}`);
    c.on("message", (msg) => {
        if (msg.type !== "utf8")
            return;
        let { token, event, data } = JSON.parse(msg.utf8Data);
        console.log({ token, data });
        events[event](c, data, token, users[token], users, games);
        console.log(users);
        console.log(games);
    });
});
ws.on("close", (c) => {
    let ref = `${c.socket.remoteAddress}:${c.socket.remotePort}`;
    let token = closeRef[ref];
    console.log(`Close connection : token : ${token}`);
    delete users[token];
    delete closeRef[ref];
});
server.listen(3000, () => console.log("Server On on port : 3000"));
