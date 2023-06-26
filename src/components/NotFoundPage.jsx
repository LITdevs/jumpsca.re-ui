import "../css/error-page.css";
import {Link} from "react-router-dom";

export default function NotFoundPage() {

	return (
		<div className="background-text error-page">
			<h1>Oops!</h1>
			<p>Sorry, this page was not found!</p>
			<Link to="/">Get back to the homepage</Link>
		</div>
	);
}