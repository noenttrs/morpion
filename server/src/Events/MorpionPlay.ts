import { EventClientData, EventFile } from "../Interface/Events";

export const event: EventFile = {
    eventType: "MORPION_PLAY",
    event(c, data: EventClientData["MORPION_PLAY"], token, user, users, games) {
        let game = games[user.room]

        if (game.invite === null) return

        let creator = users[game.creator]
        let invite = users[game.invite]

        if (game === undefined) return c.send(JSON.stringify({ 
            data: {
                error: "Your not in a room"
            }
        }));

        if (data.col === undefined && data.row === undefined) return;

        let playFromInvite = game.invite === user.token

        for (const arr of game.board) {
            let inviteWin = false
            let win = false

            if (arr.join("") === "XXX") {
                if (game.whoStart === 0 && user.token === invite.token) inviteWin = true

                win = true
            } else if (arr.join("") === "OOO") {
                if (game.whoStart === 0 && user.token === invite.token) inviteWin = true

                win = true
            }

            if (win) {
                creator.c.send(JSON.stringify({
                    data: {
                        win: !inviteWin
                    }
                }))

                invite.c.send(JSON.stringify({
                    data: {
                        win: inviteWin
                    }
                }))

                return
            }

        }

        if (game.count % 2 === game.whoStart && playFromInvite) {
            
        } else {

        }
    },
}
