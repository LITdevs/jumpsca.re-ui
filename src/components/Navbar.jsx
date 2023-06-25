import {Link} from "react-router-dom";
import "../css/navbar.css";
import {Icon} from "@iconify-icon/react";
import {useContext} from "react";
import ThemeContext from "../context/ThemeContext";

export default function Navbar() {
	const themeContext = useContext(ThemeContext);
	const theme = themeContext.theme;
	const setTheme = themeContext.setTheme;
	return (
		<div className="navbar">
			<div className="navbar-header">
				jumpsca.re <Icon tabIndex="0" style={{color: theme === "dark" ? "var(--coral-d)" : "var(--yellow)"}} className="text-aligned-icon" icon={theme === "dark" ? "ic:twotone-dark-mode" : "ic:twotone-light-mode"} onClick={() => {
					// TODO: Right click plays a little animation that throws the icon in a garbage can
					// And sets theme to undefined (for system theme)
					if (theme === "dark") {
						setTheme("light");
					} else {
						setTheme("dark");
					}
			}} />
			</div>
			<div className="navbar-item">
				meow<br />
				<Link to="/not-home">Go somehwere</Link>
			</div>
		</div>
	)
}