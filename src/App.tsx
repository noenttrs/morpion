import { useState } from 'react'
import Room from './Components/Room'

function App() {
  const [inviteCode, setInviteCode] = useState("")

  function roomEvent(event: "create" | "join", game: "morpion" | "4pow") {
    
  }

  return (
    <div className="flex justify-center w-full h-full place-items-center">
      { inviteCode === "" && <Room roomEvent={roomEvent} />}
    </div>
  )
}

export default App
