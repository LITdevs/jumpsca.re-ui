import {Link} from "react-router-dom";
import "../css/navbar.css";
import {Icon} from "@iconify-icon/react";
import {useContext} from "react";
import ThemeContext from "../context/ThemeContext";
import AuthContext from "../context/AuthContext";
import api from "../util/API";

// TODO: close navbar when clicking a link
export default function Navbar() {
	const authContext = useContext(AuthContext)
	let loggedIn = authContext.loggedIn;
	const themeContext = useContext(ThemeContext);
	const theme = themeContext.theme;
	const setTheme = themeContext.setTheme;
	return (
		<div className="navbar">
			<div className="navbar-header">
				<Link to="/" className="no-style-link">jumpsca.re</Link> <Icon tabIndex="0" style={{color: theme === "dark" ? "var(--coral-d)" : "var(--yellow)"}} className="text-aligned-icon" icon={theme === "dark" ? "ic:twotone-dark-mode" : "ic:twotone-light-mode"} onClick={() => {
					// TODO: Right click plays a little animation that throws the icon in a garbage can and sets theme to undefined (for system theme)
					if (theme === "dark") {
						setTheme("light");
					} else {
						setTheme("dark");
					}
			}} />
			</div>
			<div className="navbar-item">
				<Link to="/dashboard">
					<Icon icon="carbon:dashboard" className="text-aligned-icon" />
					<span className="navbar-item-link-text">Dashboard</span>
				</Link>
			</div>
			<div className="navbar-item">
				<Link to="/not-home">
					<Icon icon="carbon:radio" className="text-aligned-icon" />
					<span className="navbar-item-link-text">News</span>
				</Link>
			</div>
			<div className="navbar-item">
				<Link to="/not-home">
					<Icon icon="carbon:information-square" className="text-aligned-icon" />
					<span className="navbar-item-link-text">Help</span>
				</Link>
			</div>
			{
				loggedIn && <div className="navbar-item navbar-item-logout">
					<Link to="/" onClick={() => {
						api.logoutMethod();
					}}>
						<Icon icon="ic:round-log-out" className="text-aligned-icon" />
						<span className="navbar-item-link-text">Log out</span>
					</Link>
				</div>
			}
			<Link to="https://cataas.com"><img style={{maxWidth: "100%", bottom: 0, position: "absolute", zIndex: "-10000"}} src={"https://cataas.com/cat/says/cat%20jumpscare"}  alt="A cat, with the text 'cat jumpscare'"/></Link>
		</div>
	)
}