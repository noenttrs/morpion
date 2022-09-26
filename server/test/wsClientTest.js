let w3cwebsocket = require('websocket').w3cwebsocket

let wsClient = new w3cwebsocket("ws://localhost:3000", "echo-protocol")
let code;

wsClient.onmessage = (r) => {
    let msg = JSON.parse(r.data)
    console.log(msg);

    wsClient.send(JSON.stringify({
        token: msg.token,
        event: "CREATE_ROOM",
        data: {
            game: "morpion"
        }  
    }))
}

wsClient.onopen = (c) => {
    console.log("opened");
}

let wsClientInvite = new w3cwebsocket("ws://localhost:3000", "echo-protocol")

wsClientInvite.onmessage = (r) => {
    let msg = JSON.parse(r.data)
    console.log(msg);

    wsClientInvite.send(JSON.stringify({
        token: msg.token,
        event: "JOIN_ROOM",
        data: {

        }
    }))
}
