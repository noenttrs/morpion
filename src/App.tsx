import { useEffect, useState } from 'react'
import Board from './Components/Board';
import Room from './Components/Room'

interface Props {
  url: string
}

let game: "morpion" | "4pow";
let userType: "invite" | "creator"

const ws = new WebSocket(`ws://localhost:3000/`, "echo-protocol");

function App({ url }: Props) {
  const [inviteCode, setInviteCode] = useState("")
  const [inRoom, setInRoom] = useState(false)

  async function roomEvent(event: "create" | "join", gameType?: "morpion" | "4pow"): Promise<boolean> {
    if (event === "create" && gameType !== undefined) {
      game = gameType
      userType = "creator"
      setInRoom(true)
    } else if (event === "join") {
      const res = await (await fetch(`http://${url}/room?id=${inviteCode}`)).json()

      if (res.roomExist) {
        userType = "invite"
        setInRoom(true)
      }
    }

    return false
  }

  return (
    <div className="flex justify-center w-full h-full place-items-center">
      {!inRoom && <Room inviteCode={inviteCode} setInviteCode={setInviteCode} roomEvent={roomEvent} />}
      {inRoom && <Board ws={ws} url={url} game={game} invitePropsCode={inviteCode} userType={userType} />}
    </div>
  )
}

export default App
