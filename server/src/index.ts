import http from "http"
import express from "express"
import { server as wsServer } from "websocket"
import { readdirSync } from "fs"
import { EventsClient, EventFile, Game } from "./Interface/Events"

const app = express()
const server = http.createServer(app)
const ws = new wsServer({
    httpServer: server,
    autoAcceptConnections: true
})

let events: {
    [K in EventsClient]?: EventFile["event"]
} = {}

readdirSync("./server/out/Events/")
.filter((x) => x.endsWith(".js"))
.forEach((file) => {
    let { eventType, event } = require(`./Events/${file}`).event    

    events[eventType] = event
})

let users = {}
let closeRef = {}
let games: { [key: string]: Game } = {}

app.get("/room", (req, res) => {
    let id = req.query.id as string | undefined
    
    if (id === undefined) return res.send({
        error: "No id",
        roomExist: false
    })

    if (games[id] === undefined || games[id].invite === null) return res.send({
        error: "This room doesn't exist",
        roomExist: false
    })

    return res.send({
        roomExist: true
    })
})

ws.on("connect", (c) => {
    let token = (
        Date.now() +
        +(
            [...Array(10)].map(
                () => Math.floor(Math.random() * 10)
            ).join("")
        )
    ).toString(16)

    users[token] = {
        id: {
            adress: c.socket.remoteAddress,
            port: c.socket.remotePort
        },
        c: c,
        room: null
    }

    closeRef[`${c.socket.remoteAddress}:${c.socket.remotePort}`] = token

    c.send(JSON.stringify({
        event: "CREATE_TOKEN",
        data: {
            token: token
        }
    }))

    console.log(`New connection : token : ${token}`);

    c.on("message", (msg) => {
        if (msg.type !== "utf8") return
        
        let { token, event, data } = JSON.parse(msg.utf8Data)

        console.log({ token, data });

        events[event](c, data, token, users[token], users, games)

        console.log(users);
        console.log(games);
    })
})

ws.on("close", (c) => {
    let ref = `${c.socket.remoteAddress}:${c.socket.remotePort}`
    let token = closeRef[ref]

    console.log(`Close connection : token : ${token}`);

    delete users[token]
    delete closeRef[ref]
})

server.listen(3000, () => console.log("Server On on port : 3000"))
