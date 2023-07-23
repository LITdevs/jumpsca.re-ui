import {useEffect, useState} from "react";
import api from "../util/API";
import RandomSpinner from "../components/RandomSpinner";
import "../css/dashboard.css";
import {useParams} from "react-router-dom";

export default function DashboardAddress() {

	let { address } = useParams();
	let [userInfo, setUserInfo] = useState(null);
	let [addressInfo, setAddressInfo] = useState(null);
	let [showLoader, setShowLoader] = useState(true);
	useEffect(() => {
		(async () => {
			let res = await api.getAddressPrivate(address)
			setAddressInfo(res.response.address)
			setUserInfo(res.response.address.owner)
			setShowLoader(false)
		})()
	}, [address])

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
				: <DashboardContent userInfo={userInfo} addressInfo={addressInfo} />}
		</div>
	)
}

function DashboardContent(props) {
	let userInfo = props.userInfo;
	let addressInfo = props.addressInfo;
	//let [addressCards, setAddressCards] = useState([])

	/*useEffect(() => {
		if (!userInfo) return;
		console.log(userInfo)
		setAddressCards(userInfo.response.userAddresses.map(address => {
			return (
				<div key={address.name} className="address-card address-card-clickable">
					<span title={address.displayName} className="address-card-header">{address.displayName}.jumpsca.re</span>
					<span>Expires on {new Date(address.expiresAt).toLocaleDateString()}</span>
				</div>
			)
		}))
	}, [userInfo])*/

	return (
		<div>
			<div className="dashboard-address-card">
				<p style={{fontWeight: "600", fontSize: "2rem"}}>{addressInfo.displayName}.jumpsca.re {addressInfo.displayName !== addressInfo.name && <small style={{fontWeight: "normal"}}>{addressInfo.name}</small>}</p>

				<p>Here you can renew and otherwise manage this address.</p>
				<hr />
				<RenewAddress userInfo={userInfo} addressInfo={addressInfo} />
			</div>
		</div>
	)
}

function RenewAddress(props) {
	const addressInfo = props.addressInfo;
	//const userInfo = props.userInfo;
	const [years, setYears] = useState(1)
	const [problem, setProblem] = useState("");

	return (
		<div>
			<p>This address expires on {new Date(addressInfo.expiresAt).toLocaleString()}</p>
			<form onSubmit={async (e) => {
				e.preventDefault();
				setProblem("")
				let res = await api.renewAddress(addressInfo.name, Number(years));
				if (!res.request.success) return setProblem(res.response.message || "Internal Server Error");
				window.location = res.response.redirect;
			}}>
				<select style={{
					borderRadius: "3px",
					padding: "0.7rem"
				}} value={years} onInput={(e) => setYears(e.target.value)}>
					<option value={1}>1 year</option>
					<option value={2}>2 years</option>
					<option value={3}>3 years</option>
					<option value={4}>4 years</option>
					<option value={5}>5 years</option>
					<option value={6}>6 years</option>
					<option value={7}>7 years</option>
					<option value={8}>8 years</option>
					<option value={9}>9 years</option>
					<option value={10}>10 years</option>
				</select>
				<button className={"button button-green"} style={{marginLeft: "0.5rem"}}>Add time</button><br />
				{problem}
			</form>
		</div>
	)
}