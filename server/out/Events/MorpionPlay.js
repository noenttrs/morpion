"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
exports.event = {
    eventType: "MORPION_PLAY",
    event(c, data, token, user, users, games) {
        let game = games[user.room];
        if (game === undefined)
            user.c.send(JSON.stringify({
                data: {
                    error: ""
                }
            }));
    },
};
