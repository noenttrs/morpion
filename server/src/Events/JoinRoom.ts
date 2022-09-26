import { EventFile, EventClientData } from "../Interface/Events";

export const event: EventFile = {
    eventType: "JOIN_ROOM",
    event(c, data: EventClientData["JOIN_ROOM"], token, user, users, games) {
        let game = games[data?.inviteCode]
        
        if (game === undefined) c.send(JSON.stringify({
            event: "JOIN_ROOM",
            data: {
                error: "Room doesn't exist"
            }
        }))
        
        game.invite = token;
        

        c.send(JSON.stringify({
            event: "JOIN_ROOM",
            data: {
                whoStart: games[data.inviteCode].whoStart
            }
        }))
    }
}
