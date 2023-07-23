import {Icon} from "@iconify-icon/react";
import {useEffect, useState} from "react";

export default function RandomSpinner(props) {

	const [icon, setIcon] = useState("")

	let icons = [
		"svg-spinners:bouncing-ball",
		"svg-spinners:blocks-shuffle-2",
		"svg-spinners:blocks-shuffle-3",
		"svg-spinners:3-dots-fade",
		"svg-spinners:3-dots-bounce",
		"svg-spinners:3-dots-move",
		"svg-spinners:270-ring-with-bg"
	]

	useEffect(() => {
		setIcon(icons[Math.floor(Math.random()*icons.length)])

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Icon className={props.className} style={props.style} icon={icon} />
	)
}