import {useEffect, useState} from "react";
import api from "../util/API";
import RandomSpinner from "../components/RandomSpinner";
import "../css/dashboard.css";
import {Link} from "react-router-dom";

export default function Dashboard() {
	let [userInfo, setUserInfo] = useState(null);
	let [showLoader, setShowLoader] = useState(true);
	useEffect(() => {
		(async () => {
			let res = await api.getUserInfo()
			setUserInfo(res)
			setShowLoader(false)
		})()
	}, [])

	return (
		<div>
			{showLoader ?
				<RandomSpinner style={
					{color: "var(--background-text)",
						fontSize: "3rem",
						position: "absolute",
						left: "50%", top: "50%",
						transform: "translate(-50%, -50%)"
					}} />
				: <DashboardCards setShowLoader={setShowLoader} userInfo={userInfo} />}
		</div>
	)
}

function DashboardCards(props) {
	let userInfo = props.userInfo;
	let [addressCards, setAddressCards] = useState([])

	useEffect(() => {
		if (!userInfo) return;
		console.log(userInfo)
		setAddressCards(userInfo.response.userAddresses.map(address => {
			return (
				<Link to={`/dashboard/address/${address.name}`} className="address-card address-card-clickable" key={address.name}><div >
					<span title={address.displayName} className="address-card-header">{address.displayName}.jumpsca.re</span>
					<span>Expires on {new Date(address.expiresAt).toLocaleDateString()}</span>
				</div></Link>
			)
		}))
	}, [userInfo])

	return (
		<div>
			<div className="dashboard-texts">
				<p className="dashboard-header">Dashboard</p>
				<p className="dashboard-body">Hi {userInfo.response.user.displayName}! Welcome to your dashboard, here you can manage your addresses and account settings.</p>
			</div>
			<div className="address-card-container">
				{addressCards}
				<Link to="/dashboard/account"><div className="address-card address-card-account address-card-clickable">
					<span className="address-card-header">Account</span>
					<span>Manage your jumpsca.re account</span>
				</div></Link>
			</div>
		</div>
	)
}