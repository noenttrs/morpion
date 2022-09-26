import { EventClientData, EventFile } from "../Interface/Events";

export const event: EventFile = {
    eventType: "MORPION_PLAY",
    event(c, data: EventClientData["MORPION_PLAY"], token, user, users, games) {
        let game = games[user.room]

        if (game === undefined) user.c.send(JSON.stringify({ 
            data: {
                error: ""
            }
        }));
    },
}