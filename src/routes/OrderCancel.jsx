import "../css/checkout.css"
import {Icon} from "@iconify-icon/react";
import {Link} from "react-router-dom";

export default function OrderCancel (props) {
	return (
		<div className="checkout-card-container">
			<div className="checkout-card">
				<Icon icon="line-md:cancel" className="checkout-icon checkout-icon-cancel" />
				{/*line - md:confirm-circle*/}
				Your {props.type === "renewal" ? "renewal" : "address registration"} has been cancelled.
				<br /><br />
				<Link className="card-link" to="/">Back to the homepage</Link>
			</div>
		</div>
	)
}