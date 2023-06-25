import {useRouteError} from "react-router-dom";

export default function ErrorPage() {

	const error = useRouteError();
	console.error(error);

	return (
		<div className="background-text">
			<h1>Oops!</h1>
			<p>Sorry, there seems to have been an error loading that page</p>
			<a href="/">Get back to the homepage</a>
		</div>
	)
}