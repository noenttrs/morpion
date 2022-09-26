let w3cwebsocket = require('websocket').w3cwebsocket

const delay = (ms) => new Promise(() => setTimeout(() => {}, ms));

let code;

;(async () => {
    let wsClient = new w3cwebsocket("ws://localhost:3000", "echo-protocol")

    wsClient.onmessage = (r) => {
        let msg = JSON.parse(r.data)
        console.log(msg);
        
        switch (msg.event) {
            case "CREATE_TOKEN":
                wsClient.send(JSON.stringify({
                    token: msg.token,
                    event: "CREATE_ROOM",
                    data: {
                        game: "morpion"
                    }  
                }))
                break;
                
            case "CREATE_ROOM":
                console.log(msg);
                code = msg.invite
                break;
                    
            default:
                break;
        }
    }
                
    wsClient.onopen = (c) => {
        console.log("opened");
    }

    let wsClientInvite = new w3cwebsocket("ws://localhost:3000", "echo-protocol")
    let secondToken;

    wsClientInvite.onmessage = async (r) => {
        let msg = JSON.parse(r.data)
        console.log(msg);
        
        await delay(500)
        console.log("a");

        switch (msg.event) {
            case "CREATE_TOKEN":
                secondToken = msg.token
                wsClientInvite.send(JSON.stringify({
                    token: msg.token,
                    event: "JOIN_ROOM",
                    data: {
                        invite: code
                    }
                }))
                break;
            
            default:
                break;
        }
        
        console.log(code);
    }
})();