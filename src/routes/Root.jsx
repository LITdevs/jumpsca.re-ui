import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/root.css";
import {useEffect, useState} from "react";
import {Icon} from "@iconify-icon/react";

const magicNumber = 862;

// Root layout, contains the nav and then the page content
export default function Root() {

	// Deal with navbar open/close (only for teeny tiny screens)
	const [navOpen, setNavOpen] = useState(false);

	// Deal with window resizing
	const [windowSize, setWindowSize] = useState({width: window.innerWidth, height: window.innerHeight})
	useEffect(() => {
		const handleWindowResize = () => {
			setWindowSize({width: window.innerWidth, height: window.innerHeight});
			if (navOpen && window.innerWidth > magicNumber) setNavOpen(false); // Close navbar if it's open, and we're on a big screen now
		};

		window.addEventListener('resize', handleWindowResize);

		return () => {
			window.removeEventListener('resize', handleWindowResize);
		};
		// I don't want a new listener every time the nav is opened or closed, so I'm not including navOpen in the dependency array
		// React says that's bad, but I don't know what else to do about it :(
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="root-container">
			<div className="announcement-banner">
				<span className="announcement-banner-text">This site is still under construction. (╯°□°）╯︵ ┻━┻</span>
			</div>
			<div className="root-content-container">
				{
					// Display big = navbar open button
					windowSize.width <= magicNumber && <Icon style={{
						color: "var(--nav-menu-button)",
						position: "absolute",
						top: "0.5rem",
						right: "0.5rem",
						fontSize: "2rem",
						zIndex: "1000"
					}} icon="ic:baseline-menu" onClick={() => {
						setNavOpen(p => !p);
					}} />
				}
				<div className="root-content">
					{ !navOpen && <Outlet/> }
				</div>
				<div className="root-right" onClick={(e) => {
					if (e.target.nodeName === "A" && navOpen) setNavOpen(false);
				}}>
					{
						// Display smol = no big fat navbar
						// 800 is a totally arbitrary number, but it seems pretty ok
						// hello this is me from a couple hours later, it is no longer arbitrary
						// it is now 862. that is all.
						// hi this is me 4 months later, what?? what the heck is this number??? what is it based on??
						(windowSize.width > magicNumber|| navOpen) && <Navbar />
					}
				</div>
			</div>
		</div>
	);
}