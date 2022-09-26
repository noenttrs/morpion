"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
exports.event = {
    eventType: "CREATE_ROOM",
    event(c, data, token, user, users, games) {
        user.room = (Date.now() +
            +([...Array(10)].map(() => Math.floor(Math.random() * 10)).join(""))).toString(16);
        let game = {
            type: data.game,
            creator: token,
            invite: null,
            whoStart: Math.floor(Math.random()),
            board: []
        };
        switch (data.game) {
            case "morpion":
                game.board = [...Array(3).fill([...Array(3).fill("")])];
                c.send(JSON.stringify({
                    event: "CREATE_ROOM",
                    data: {
                        inviteCode: user.room
                    }
                }));
                break;
            default:
                break;
        }
        games[user.room] = game;
    }
};
