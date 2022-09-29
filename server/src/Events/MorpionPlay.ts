import { EventClientData, EventFile } from "../Interface/Events";

export const event: EventFile = {
    eventType: "MORPION_PLAY",
    event(c, data: EventClientData["MORPION_PLAY"], token, user, users, games) {
        let game = games[user.room]
console.log(game);

        if (game.invite === null) return

        let creator = users[game.creator]
        let invite = users[game.invite]

        if (game === undefined) return c.send(JSON.stringify({ 
            data: {
                error: "Your not in a room"
            }
        }));

        if (data.col === undefined && data.row === undefined) return;

        let playFromWho = game.invite === user.token ? "invite" : "creator"
        let wichTurn = game.count % 2 === game.whoStart ? "invite" : "creator"

        console.log(game.board);
        
        // if (wichTurn === playFromWho) game.board[data.col][data.row] = "x"
        // else game.board[0][0] = "o"

        game.board[data.col][data.row] = "x"

        console.log(data.col, data.row);
        
        console.log(game.board);
        

        let inviteWin = false
        let win = false

        for (const arr of game.board) {
            if (arr.join("") === "xxx") {
                if (game.whoStart === 0 && user.token === invite.token) inviteWin = true

                win = true
            } else if (arr.join("") === "ooo") {
                if (game.whoStart === 0 && user.token === invite.token) inviteWin = true

                win = true
            }

            if (win) break
        }

        if (win) {
            creator.c.send(JSON.stringify({
                data: {
                    win: !inviteWin,
                }
            }))

            invite.c.send(JSON.stringify({
                data: {
                    win: inviteWin,
                }
            }))

            return
        } else {
            let toSend = JSON.stringify({
                event: "MORPION_PLAY",
                data: {
                    board: game.board
                }
            })

            creator.c.send(toSend)
            invite.c.send(toSend)
        }
    },
}
