import "../css/checkout.css"
import {Icon} from "@iconify-icon/react";
import {Link, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../util/API";

// TODO: Handle already logged in users

export default function Register() {

	const [warning, setWarning] = useState();
	const [searchParams] = useSearchParams();
	let address = searchParams.get("address");


	function displayProblem (problemDescription) {
		setWarning(<>
			<Icon icon="line-md:alert" className="checkout-icon checkout-icon-cancel"/>
			There was a problem during your registration<br />
			{problemDescription}<br /><br />
			If you were redirected here, please email support at help@jumpsca.re or try again later<br /><br />
			<Link className="card-link" to="/">Back to the homepage</Link>
		</>)
	}

	useEffect(() => {
		if (!address) return displayProblem("Address not specified")
		// noinspection JSCheckFunctionSignatures
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address])


	return (
		<div className="checkout-card-container">
			<div className="checkout-card">
				{
					// Display loading spinner while fetching order data from API
					(!warning ? <RegisterCard displayProblem={displayProblem} address={address} />
						: warning)
				}
			</div>
		</div>
	)
}

function RegisterCard(props) {
	let address = props.address;
	let displayProblem = props.displayProblem;
	const [email, setEmail] = useState();
	const [emailValid, setEmailValid] = useState(false);
	const [years, setYears] = useState(1);
	let emailRegex = /^[^@]+@[^@]+\.[^@]+$/

	useEffect(() => {
		verifyEmail(email)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [email])

	const verifyEmail = (email) => {
		console.log(email)
		setEmailValid(emailRegex.test(email))
	}

	const beginCheckout = async () => {
		let emailAddress = email
		console.log(`Checkout: ${address} ${emailAddress} ${years}y`)
		try {
			let res = await api.registerAddress(address, emailAddress, years);
			if (!res.request.success) return displayProblem(res.response.message || "Internal Server Error");
			window.location = res.response.redirect;
		} catch (e) {
			displayProblem(e)
		}
	}

	return (<>
		<Icon icon="line-md:loading-twotone-loop" className="checkout-icon"/>
		<span style={{fontWeight: "600"}}>Finish your address registration</span>
		<br/><br/>
		<div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
								<span style={{textAlign: "left", paddingLeft: "10%"}}>{address}.jumpsca.re <select onChange={(e) => {
									console.log(e.target.value)
									setYears(Number(e.target.value))
								}} value={years}>
									<option value="1">1 year</option>
									<option value="2">2 years</option>
									<option value="3">3 years</option>
									<option value="4">4 years</option>
									<option value="5">5 years</option>
									<option value="6">6 years</option>
									<option value="7">7 years</option>
									<option value="8">8 years</option>
									<option value="9">9 years</option>
									<option value="10">10 years</option>
								</select></span>
			<span id={"priceDisplay"} style={{textAlign: "right", paddingRight: "10%"}}>{(years * 2).toFixed(2)} €</span>
		</div>
		<br />
		<span>Please enter your email address.<br />Make sure to enter an address where you can receive messages, because this address will be used for logging in to jumpsca.re</span>
		<input id="emailInput" className="email-input" type="email" onChange={(e) => {
			setEmail(e.target.value)
		}} />
		<br />
		<button id="registerButton" className="button" disabled={!emailValid} onClick={() => beginCheckout()}>Proceed to checkout</button>
	</>)
}