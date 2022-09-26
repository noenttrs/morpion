import { EventFile, EventClientData, Game } from "../Interface/Events";

export const event: EventFile = {
    eventType: "CREATE_ROOM",
    event(c, data: EventClientData["CREATE_ROOM"], token, user, users, games) {
        console.log(user);
        
        user.room = (
            Date.now() +
            +(
                [...Array(10)].map(
                    () => Math.floor(Math.random() * 10)
                ).join("")
            )
        ).toString(16)

        let game: Game = {
            type: data.game,
            creator: token,
            invite: null,
            whoStart: Math.floor(Math.random()),
            board: []
        }

        switch (data.game) {
            case "morpion":
                game.board = [...Array(3).fill([...Array(3).fill("")])]

                c.send(JSON.stringify({
                    event: "CREATE_ROOM",
                    data: {
                        inviteCode: user.room
                    }
                }))
                break;
        
            default:
                break;
        }

        games[user.room] = game
    }
}