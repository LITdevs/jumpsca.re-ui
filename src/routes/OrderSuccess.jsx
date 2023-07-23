import "../css/checkout.css"
import {Icon} from "@iconify-icon/react";
import {Link, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import RandomSpinner from "../components/RandomSpinner";
import api from "../util/API";

export default function OrderSuccess (props) {

	const [order, setOrder] = useState();
	const [searchParams] = useSearchParams();
	let sessionId = searchParams.get("session");


	function displayProblem (problemDescription) {
		setOrder(<>

			<Icon icon="line-md:alert" className="checkout-icon checkout-icon-cancel"/>
			There was a problem processing your {props.type === "renewal" ? "renewal" : "address registration"}.<br />
			{problemDescription}<br /><br />
			If you were redirected here after payment, please email support at help@jumpsca.re<br /><br />
			<Link className="card-link" to="/">Back to the homepage</Link>
		</>)
	}

	useEffect(() => {
		(async () => {
			if (!sessionId) return displayProblem("Session ID was not found.")
			let orderData = await api.getCheckoutSession(sessionId)

			if (!orderData.request.success) return displayProblem(orderData.response.message);

			let session = orderData.response.session;
			// noinspection JSCheckFunctionSignatures
			setOrder(
				<>
					<Icon icon="line-md:confirm-circle" className="checkout-icon checkout-icon-success"/>
					<span style={{fontWeight: "600"}}>Your {props.type === "renewal" ? "renewal" : "address registration"} has been processed.</span>
					<br/><br/>
					{
						session.lineItems.map(lineItem => {
							return (<div key={lineItem.address} style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
								<span style={{textAlign: "left", paddingLeft: "10%"}}>{lineItem.address}.jumpsca.re ({lineItem.quantity} year{lineItem.quantity > 1 && "s"})</span>
								<span style={{textAlign: "right", paddingRight: "10%"}}>{(lineItem.total / 100).toFixed(2)} €</span>
							</div>)
						})
					}
					<br />
					<span style={{textAlign: "right", paddingRight: "10%"}}>Subtotal: {(session.subtotal / 100).toFixed(2)} €</span>
					<span style={{textAlign: "right", paddingRight: "10%"}}>Tax: {(session.tax / 100).toFixed(2)} €</span>
					<span style={{textAlign: "right", paddingRight: "10%"}}>Discounts: {(session.discount / 100).toFixed(2)} €</span>
					<hr style={{height: "1px", width: "80%", border: "none", backgroundColor: "var(--dark-d)", borderRadius: "0.2rem"}} />
					<span style={{textAlign: "right", paddingRight: "10%"}}>Total : {(session.total / 100).toFixed(2)} €</span>

					<br/><br/>
					<Link className="card-link" to="/dashboard?new=true">Go to your dashboard</Link>
				</>)
		})();
		
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.type])


	return (
		<div className="checkout-card-container">
			<div className="checkout-card">
				{
					// Display loading spinner while fetching order data from API
					(!order ? <>
						<RandomSpinner className="checkout-icon" style={{fontSize: "6rem"}} />
						Your {props.type === "renewal" ? "renewal" : "address registration"} is being processed.
					</>
					: order)
				}
			</div>
		</div>
	)
}