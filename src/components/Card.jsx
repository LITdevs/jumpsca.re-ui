import "../css/card.css";
export default function Card(props) {
	const title = props.title;
	const body = props.body;
	const color = props.color;
	const bgText = props["bg-text"];
	const bgTextLeft = props["bg-text-left"];
	const bgTextTop = props["bg-text-top"];
	const bgTextRight = props["bg-text-right"];
	const bgTextBottom = props["bg-text-bottom"];
	const bgTextSize = props["bg-text-size"];
	const height = props.height;
	const width = props.width;

	return (
		<div className="card" style={{backgroundColor: `var(--${color})`,
		width: width, height: height}}>
			<div className="card-header">
				{title}
			</div>
			<div className="card-body">
				{body.replaceAll("\\n", "\n")}
			</div>
			<div className="card-bg-text" style={{color: `var(--${color}-d)`, top: bgTextTop, left: bgTextLeft, bottom: bgTextBottom, right: bgTextRight, fontSize: bgTextSize}}>
				{bgText}
			</div>
		</div>
	)
}