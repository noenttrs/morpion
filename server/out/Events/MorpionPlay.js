"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
exports.event = {
    eventType: "MORPION_PLAY",
    event(c, data, token, user, users, games) {
        let game = games[user.room];
        if (game.invite === null)
            return;
        let creator = users[game.creator];
        let invite = users[game.invite];
        if (game === undefined)
            return c.send(JSON.stringify({
                data: {
                    error: "Your not in a room"
                }
            }));
        if (data.case === undefined)
            return;
        let playFromInvite = game.invite === user.token;
        for (const arr of game.board) {
            let inviteWin = false;
            let win = false;
            if (arr.join("") === "XXX") {
                if (game.whoStart === 0 && user.token === invite.token)
                    inviteWin = true;
                win = true;
            }
            else if (arr.join("") === "OOO") {
                if (game.whoStart === 0 && user.token === invite.token)
                    inviteWin = true;
                win = true;
            }
            if (win) {
                creator.c.send(JSON.stringify({
                    data: {
                        win: !inviteWin
                    }
                }));
                invite.c.send(JSON.stringify({
                    data: {
                        win: inviteWin
                    }
                }));
                return;
            }
        }
        if (game.count % 2 === game.whoStart && playFromInvite) {
        }
        else {
        }
    },
};
