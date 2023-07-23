import {useEffect, useState} from "react";
import api from "../util/API";
import RandomSpinner from "../components/RandomSpinner";
import "../css/dashboard.css";
import {Icon} from "@iconify-icon/react";

export default function DashboardAccount() {
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
				: <DashboardContent userInfo={userInfo} />}
		</div>
	)
}

function DashboardContent(props) {
	let userInfo = props.userInfo;
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
			<div className="dashboard-account-card">
				<p style={{fontWeight: "600", fontSize: "2rem"}}>Account settings</p>
				<p>Here you can manage your account, such as change your password, email or log out sessions.</p>
				<hr />
				<ChangePassword userInfo={userInfo} />
			</div>
		</div>
	)
}

function ChangePassword(props) {
	const [newPassword, setNewPassword] = useState("");
	const [signOutOthers, setSignOutOthers] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [problem, setProblem] = useState("");
	const passwordComplexityRegex = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$%^&*()\-_+.§½?\\/])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/

	return (
		<form onSubmit={async (e) => {
			e.preventDefault();
			setIsLoading(true)
			setProblem("");
			if (!passwordComplexityRegex.test(newPassword)) {
				setProblem("Password does not meet complexity requirement! Please include at least 2 uppercase characters, 1 special character, 2 numbers, 3 lowercase characters.");
				setIsLoading(false)
				return;
			}
			let res = await api.changePassword(newPassword, signOutOthers)
			switch (res.request.status_code) {
				case 200:
					setNewPassword("");
					setSignOutOthers(false)
					break;
				case 400:
					setProblem(res.response.message)
					break;
				case 500:
					setProblem("Internal Server Error, try again later and email support at help@jumpsca.re if the issue persists")
					break;
				default:
					setProblem(`Unknown problem! Email support at help@jumpsca.re, and include the following in your message: ${JSON.stringify(res)}`)
					break;
			}
			setIsLoading(false)
		}}>
			<p style={{fontWeight: "600"}}>Change your password</p>
			<p>You can set a new password to use when logging in</p>
			<input name="signOutOther" checked={signOutOthers} onChange={(e) => setSignOutOthers(e.target.checked)} type="checkbox" className="checkbox" />
			<label onClick={() => setSignOutOthers(p => !p)} htmlFor={"signOutOther"}>Sign out other devices</label><br />
			<input type="email" autoComplete={"email"} readOnly={true} hidden={true} value={props.userInfo.response.user.email} />
			<input type="password" minLength={8} value={newPassword} onInput={(e) => setNewPassword(e.target.value)} className={`input${problem ? " input-problem" : ""}`} autoComplete={"new-password"} placeholder={"New password"}/><br />
			<button disabled={isLoading} className="button">{isLoading ? <Icon icon="svg-spinners:90-ring-with-bg" className={"text-aligned-icon"}
			                                              style={{fontSize: "1.2rem"}}/> : "Change password"}</button>
			<br /><p style={{color: "var(--checkout-cancel-color)"}}>{problem}</p>
		</form>
	)
}