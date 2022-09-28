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

    let baseBoard = useMemo(() => {
        if (userType === "creator") {
            if (game === "morpion") return [...Array(3)].map(x => [...Array(3)].fill(""))
            else if (game === "4pow") return [...Array(3)].map(x => [...Array(3)].fill(""))
        }

        return [...Array(3)].map(x => [...Array(3)].fill(""))
    }, [])

    const [board, setBoard] = useState<string[][]>(baseBoard)
    const [inviteCode, setInviteCode] = useState(invitePropsCode)

    function onPlay (col: number, row: number) {

    }

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:3000/`, "echo-protocol");

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

                        ws.send(JSON.stringify({
                            token,
                            event: "CREATE_ROOM",
                            data: {
                                game
                            }
                        }))
                        break

                    case EventsServer.CREATE_ROOM:
                        data = data as EventsServerData[typeof event]

                        console.log(data);

                        setInviteCode(data.inviteCode)
                        break
                    
                    case EventsServer.JOIN_ROOM:
                        data = data as EventsServerData[typeof event]


                        break

                    case EventsServer.MORPION_PLAY:
                        data = data as EventsServerData[typeof event]

                        
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

    if (game === "morpion") return (
        <Morpion
            onPlay={onPlay}
            inviteCode={inviteCode}
            board={board}
            showCode={showCode}
        />
    )
    else if (game === "4pow") return <FourPow />
    else return <div>Error</div>
}