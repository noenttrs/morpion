import { useState } from "react"

interface Props {
	roomEvent: (event: "create" | "join", game: "morpion" | "4pow") => void;
}

export default function Room ({ roomEvent }: Props) {
	let [game, setGame] = useState<"morpion" | "4pow" | "">("")
	let [code, setCode] = useState("")

	function onClickRoom(event: "create" | "join") {
		if (event === "create" && game !== "") return
		else return roomEvent("create", "morpion")

		// if (event === "join" && )
	}

	return (
		<div className="room">
			<div className="join-room">
				<input 
					onChange={
						({ target: { value } }) => setCode(value)
					}
					value={code} 
					placeholder="Code d'invitation" 
					className="h-16 w-full text-xl text-center border-2 border-white" 
					minLength={4} 
					maxLength={20} 
					type="text"
				/>
				<button onClick={() => onClickRoom("join")}>Rejoindre une salle</button>
			</div>
			<p className="m-4 text-xl">OU</p>
			<div className="create-room">
				<div className="flex justify-around border-2 border-white">
					<button onClick={() => setGame("morpion")} className={game === "morpion" ? "border-2" : ""}>Morpion</button>
					<button onClick={() => setGame("4pow")} className={game === "4pow" ? "border-2" : ""}>Puissance 4</button>
				</div>
				<button onClick={() => onClickRoom("create")}>Créer une salle</button>
			</div>
		</div>
	)
}