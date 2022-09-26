"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
exports.event = {
    eventType: "JOIN_ROOM",
    event(c, data, token, user, users, games) {
        let game = games[data === null || data === void 0 ? void 0 : data.inviteCode];
        if (game === undefined)
            c.send(JSON.stringify({
                event: "JOIN_ROOM",
                data: {
                    error: "Room doesn't exist"
                }
            }));
        game.invite = token;
        c.send(JSON.stringify({
            event: "JOIN_ROOM",
            data: {
                whoStart: games[data.inviteCode].whoStart
            }
        }));
    }
};
