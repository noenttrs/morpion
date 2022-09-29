import { useEffect, useMemo, useState, useTransition } from "react";
import { EventsServerData, EventsServer } from "../../server/src/Interface/Events"
import FourPow from "./Boards/FourPow";
import Morpion from "./Boards/Morpion";

export interface BoardProps {
    url: string;
    game: "morpion" | "4pow"
    invitePropsCode: string,
    userType: "creator" | "invite"
}

let token: string;

export default function Board ({ 
    url,
    game, 
    invitePropsCode,
    userType
}: BoardProps) {
    const [gameType, setGameType] = useState(game)

    let baseBoard = useMemo(() => {
        if (gameType === "morpion") return [...Array(3)].map(x => [...Array(3)].fill(""))
        else if (gameType === "4pow") return [...Array(3)].map(x => [...Array(3)].fill(""))

        return [...Array(3)].map(x => [...Array(3)].fill(""))
        // return [
        //     ["x", "o", "x"],
        //     ["o", "x", "o"],
        //     ["o", "o", "o"]
        // ]
    }, [gameType])

    const [ws, setWs] = useState<WebSocket>()
    const [board, setBoard] = useState<string[][]>(baseBoard)
    const [inviteCode, setInviteCode] = useState(invitePropsCode)
    const [inviteJoin, setInviteJoin] = useState(false)
    const [whoStart, setWhoStart] = useState<number>()
    const [count, setCounter] = useState(0)
    const [showCode, setShowCode] = useState(userType === "creator")

    let [topSentence, wichTurn] = useMemo(() => {
        if (count % 2 === whoStart) {
            switch (userType) {
                case "invite":
                    return ["Votre tour", "invite"]
            
                case "creator":
                    return ["Tour de l'autre joueur", "invite"]
            }
        } else {
            switch (userType) {
                case "creator":
                    return ["Votre tour", "creator"]
            
                case "invite":
                    return ["Tour de l'autre joueur", "creator"]
            }
        }
    }, [count, whoStart])

    function onPlay (col: number, row: number) {
        console.log(col, row);

        if (ws === undefined) return
        if (!inviteJoin) return

        if (wichTurn !== userType) return

        console.log("play");
        
        ws.send(JSON.stringify({
            token,
            event: "MORPION_PLAY",
            data: {
                col,
                row
            }
        }))
    }

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:3000/`, "echo-protocol");
        setWs(ws)

        ws.onmessage = (msg) => {
            let { event, data }: {
                event: keyof EventsServerData,
                data: EventsServerData[EventsServer]
            } = JSON.parse(msg.data)

            try {
                console.log(data);

                switch (event) {
                    case EventsServer.CREATE_TOKEN:
                        data = data as EventsServerData[typeof event]
                        
                        token = data.token

                        if (userType === "creator") {
                            ws.send(JSON.stringify({
                                token,
                                event: "CREATE_ROOM",
                                data: {
                                    game
                                }
                            }))
                        } else if (userType === "invite") {
                            ws.send(JSON.stringify({
                                token,
                                event: "JOIN_ROOM",
                                data: {
                                    inviteCode
                                }
                            }))
                        }
                        break

                    case EventsServer.CREATE_ROOM:
                        data = data as EventsServerData[typeof event]

                        console.log(data);

                        setInviteCode(data.inviteCode)
                        break

                    case EventsServer.JOIN_ROOM:
                        data = data as EventsServerData[typeof event]

                        setInviteJoin(true)

                        if (userType === "invite") setGameType(data.game)

                        setWhoStart(data.whoStart)
                        setShowCode(false)
                        break

                    case EventsServer.MORPION_PLAY:
                        data = data as EventsServerData[typeof event]

                        console.log(data);
                        
                        setCounter(count + 1)
                        setBoard(data.board)
                        break

                    default:
                        break;
                }
            } catch (error) {
                console.log(error);
            }
        }

        return () => {
            console.log("close");
            
            ws.close()
        }
    }, [])

    if (gameType === "morpion") return (
        <Morpion
            onPlay={onPlay}
            inviteCode={inviteCode}
            topSentence={topSentence}
            board={board}
            showCode={showCode}
        />
    )
    else if (gameType === "4pow") return <FourPow />
    else return <div>Chargement</div>
}