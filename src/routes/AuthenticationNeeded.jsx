import "../css/checkout.css"
import "../css/login.css"
import {Icon} from "@iconify-icon/react";
import {Link, Outlet} from "react-router-dom";
import {useContext, useState} from "react";
import api from "../util/API";
import AuthContext from "../context/AuthContext";

// TODO: Handle already logged in users

export default function AuthenticationNeeded() {

	const authContext = useContext(AuthContext);
	const loggedIn = authContext.loggedIn;
	const [warning, setWarning] = useState();
	const [loginMethod, setLoginMethod] = useState();


	function displayProblem (problemDescription) {
		setWarning(<>
			<Icon icon="line-md:alert" className="checkout-icon checkout-icon-cancel"/>
			There was a problem while logging in<br />
			{problemDescription}<br /><br />
			If you were redirected here, please email support at help@jumpsca.re or try again later<br /><br />
			<Link className="card-link" to="/">Back to the homepage</Link>
		</>)
	}


	return (
		<>
		{
			// If logged in, show the page we are trying to access
			// If not, show login
			// If there is an error, show that instead of login
			loggedIn ? <Outlet />
				: <div className="checkout-card-container">
					<div className="checkout-card">
						{
							(!warning ? (<>
								{!loginMethod && <LoginMethodPicker setLoginMethod={setLoginMethod} displayProblem={displayProblem}/>}
								{loginMethod === "email" && <EmailLogin setLoginMethod={setLoginMethod} displayProblem={displayProblem}/>}
								{loginMethod === "password" && <PasswordLogin setLoginMethod={setLoginMethod} displayProblem={displayProblem}/>}
							</>) : warning)
						}
					</div>
				</div>
		}
		</>
	)
}

function PasswordLogin(props) {
	let [email, setEmail] = useState();
	let [password, setPassword] = useState();
	let [showSpinner, setShowSpinner] = useState(false);
	let [problem, setProblem] = useState();
	let authContext = useContext(AuthContext);
	let setAccessToken = authContext.setAccessToken;
	let setRefreshToken = authContext.setRefreshToken;

	return (
		<div className="login-card">
			<Icon icon="ic:round-arrow-back" style={{position: "absolute", top: "1rem", left: "0rem", fontSize: "2rem", cursor: "pointer"}} onClick={() => props.setLoginMethod(undefined)} />
			<span style={{fontWeight: "600", fontSize: "1.5rem", paddingTop: "1rem"}}>Sign in with email and password</span><br />
			<small>If you have not set a password yet, sign in with email first to set one</small><br />
			<form onSubmit={async (e) => {
				e.preventDefault()
				setProblem(undefined)
				setShowSpinner(true)
				let res = await api.attemptLoginPassword(email, password);
				console.log(res)
				setShowSpinner(false)
				switch (res.request.status_code) {
					case 200:
						setAccessToken(res.response.accessToken);
						setRefreshToken(res.response.refreshToken);
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
			}}>
				<input type="email" autoComplete={"email"} onInput={(e) => setEmail(e.target.value)} className={problem ? "email-input email-input-problem" : "email-input"} placeholder="example@lettuce.systems" required={true}/>
				<input type="password" autoComplete={"current-password"} onInput={(e) => setPassword(e.target.value)} className={problem ? "email-input email-input-problem" : "email-input"} placeholder="MyPassword123" required={true}/> <br/>
				<button type="submit" disabled={showSpinner} className="button login-button login-button-login">
					{showSpinner ? <Icon icon="svg-spinners:90-ring-with-bg" className={"text-aligned-icon"} style={{fontSize: "1.2rem"}} /> : "Sign in"}
				</button>
				<br />
				<span style={{color: "var(--checkout-cancel-color)", filter: "brightness(95%)"}}>{problem}</span>
			</form>
		</div>
	)
}

function EmailLogin(props) {
	let [email, setEmail] = useState();
	let [emailCode, setEmailCode] = useState();
	let [showSpinner, setShowSpinner] = useState(false);
	let [problem, setProblem] = useState();
	let [stage, setStage] = useState(1);
	let authContext = useContext(AuthContext);
	let setAccessToken = authContext.setAccessToken;
	let setRefreshToken = authContext.setRefreshToken;

	return (
		<div className="login-card">
			<Icon icon="ic:round-arrow-back" style={{position: "absolute", top: "1rem", left: "0rem", fontSize: "2rem", cursor: "pointer"}} onClick={() => props.setLoginMethod(undefined)} />
			<span style={{fontWeight: "600", fontSize: "1.5rem", paddingTop: "1rem"}}>Sign in with email</span><br />
			{stage === 1 && <><small>You will be sent a one-time password via email</small><br />
				<form onSubmit={async (e) => {
				e.preventDefault()
				setProblem(undefined)
				setShowSpinner(true)
				let res = await api.requestLoginEmail(email);
				switch (res.request.status_code) {
					case 200:
						setStage(2)
						break;
					case 400:
						setProblem(res.response.message)
						break;
					case 401:
						setProblem(res.response.message)
						break;
					case 500:
						setProblem("Internal Server Error, try again later and email support at help@jumpsca.re if the issue persists")
						break;
					default:
						setProblem(`Unknown problem! Email support at help@jumpsca.re, and include the following in your message: ${JSON.stringify(res)}`)
						break;
				}
				setShowSpinner(false)
			}}>
				<input type="email" autoComplete={"email"} onInput={(e) => setEmail(e.target.value)}
				       className={problem ? "email-input email-input-problem" : "email-input"}
				       placeholder="example@lettuce.systems" required={true}/><br/>
				<button type="submit" disabled={showSpinner} className="button login-button login-button-login">
					{showSpinner ? <Icon icon="svg-spinners:90-ring-with-bg" className={"text-aligned-icon"}
					                     style={{fontSize: "1.2rem"}}/> : "Request code"}
				</button>
				<br/>
				<span style={{color: "var(--checkout-cancel-color)", filter: "brightness(95%)"}}>{problem}</span>
			</form></>
			}
			{stage === 2 && <><small>Check your email! You have been sent a one-time password. If you can't find it, check the spam folder or try again, if the issue persists email support at help@jumpsca.re</small><br />
				<form onSubmit={async (e) => {
					e.preventDefault()
					setProblem(undefined)
					setShowSpinner(true)
					let res = await api.attemptLoginEmail(email, emailCode);
					switch (res.request.status_code) {
						case 200:
							setAccessToken(res.response.accessToken);
							setRefreshToken(res.response.refreshToken);
							break;
						case 400:
							setProblem(res.response.message)
							break;
						case 401:
							setProblem(res.response.message)
							break;
						case 500:
							setProblem("Internal Server Error, try again later and email support at help@jumpsca.re if the issue persists")
							break;
						default:
							setProblem(`Unknown problem! Email support at help@jumpsca.re, and include the following in your message: ${JSON.stringify(res)}`)
							break;
					}
					setShowSpinner(false)
				}}>
					<input type="text" autoComplete={"one-time-code"} onInput={(e) => setEmailCode(e.target.value)}
					       className={problem ? "email-input email-input-problem" : "email-input"}
					       placeholder="0a0000aa" minLength={8} maxLength={8} required={true}/><br/>
					<button type="submit" disabled={showSpinner} className="button login-button login-button-login">
						{showSpinner ? <Icon icon="svg-spinners:90-ring-with-bg" className={"text-aligned-icon"}
						                     style={{fontSize: "1.2rem"}}/> : "Sign in"}
					</button>
					<br/>
					<span style={{color: "var(--checkout-cancel-color)", filter: "brightness(95%)"}}>{problem}</span>
				</form></>
			}
		</div>
	)
}

function LoginMethodPicker(props) {

	// TODO: i REALLY hate how this looks
	return (<div className="login-card">
		<span style={{fontWeight: "600", fontSize: "1.5rem"}}>Choose a sign in method</span>
		<br />
		<span>You can sign in using an email and password, or with a one-time password sent to your email</span>
		<br />
		<br />
		<button className="button login-button login-button-password" onClick={() => props.setLoginMethod("password")}>Sign in with password</button>
		<br />
		<button className="button login-button login-button-email" onClick={() => props.setLoginMethod("email")}>Sign in with email</button>
	</div>)
}