import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/root.css";

// Root layout, contains the nav and then the page content
export default function Root() {
	return (
		<div className="root-container">
			<div className="root-content">
				<Outlet />
			</div>
			<div className="root-right">
				<Navbar />
			</div>
		</div>
	);
}