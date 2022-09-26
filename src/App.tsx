import { useState } from 'react'
import Room from './Components/Room'

function App() {
  const [inviteCode, setInviteCode] = useState("")

  return (
    <div className="w-full h-full flex place-items-center justify-center">
      { inviteCode === "" && <Room />}
    </div>
  )
}

export default App
