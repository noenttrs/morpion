import { useState } from "react"

export default function Room () {
    let [game, setGame] = useState("")

    function selectGame(game: string) {
        setGame(game)
    }

    return (
        <div className="room">
            <div className="join-room">
                <input className="w-full border-white border-2" type="text"/>
            </div>
            <p className="m-4 text-xl">OU</p>
            <div className="create-room">
                <div className="border-white border-2">
                    <button className={game === "morpion" ? "border-2" : ""} onClick={() => selectGame("morpion")}>Morpion</button>
                    <button className={game === "4pow" ? "border-2" : ""} onClick={() => selectGame("4pow")}>Puissance 4</button>
                </div>
                <button className="text-center text-black border-4 border-white bg-white w-full h-16 mt-2">Create Room</button>
            </div>
        </div>
    )
}