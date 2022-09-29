import { useEffect, useMemo, useState } from "react";
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

export default function BoardMorpion ({ 
    url,
    game, 
    invitePropsCode,
    userType
}: BoardProps) {
    let showCode = useMemo(() => {
        return invitePropsCode === ""
    }, [invitePropsCode])

    const [gameType, setGameType] = useState(game)

    let baseBoard = useMemo(() => {
        if (gameType === "morpion") return [...Array(3)].map(x => [...Array(3)].fill(""))
        else if (gameType === "4pow") return [...Array(3)].map(x => [...Array(3)].fill(""))

        return [...Array(3)].map(x => [...Array(3)].fill(""))
    }, [gameType])

    const [ws, setWs] = useState<WebSocket>()
    const [board, setBoard] = useState<string[][]>(baseBoard)
    const [inviteCode, setInviteCode] = useState(invitePropsCode)
    const [inviteJoin, setInviteJoin] = useState(false)
    const [whoStart, setWhoStart] = useState()
    const [count, setCounter] = useState(0)

    let topSentence = useMemo(() => {
        if (count % 2 === whoStart) {
            switch (userType) {
                case "invite":
                    return "Votre tour"
            
                case "creator":
                    return "Tour de l'autre joueur"
            }
        } else {
            switch (userType) {
                case "creator":
                    return "Votre tour"
            
                case "invite":
                    return "Tour de l'autre joueur"
            }
        }
    }, [count, whoStart])

    function onPlay (col: number, row: number) {
        if (ws === undefined) return
        if (!inviteJoin) return

        ws.send(JSON.stringify({
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
                        console.log(data);

                        if (userType === "invite") {
                            setGameType(data.game)
                            console.log(data.game);
                            
                        }
                        break

                    case EventsServer.MORPION_PLAY:
                        data = data as EventsServerData[typeof event]

                        setBoard(data.board)
                        break

                    default:
                        break;
                }
            } catch (error) {
                console.log(error);
            }
        }

        return () => ws.close()
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