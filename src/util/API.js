let apiUrl;
let wcUrl;
switch (process.env.REACT_APP_JR_ENV) {
	case "local":
		apiUrl = "http://localhost:18665"
		wcUrl = "http://localhost:45303"
		break;
	case "phoenix":
		apiUrl = "https://api.phoenix.jumpsca.re"
		wcUrl = "https://phoenix.wanderers.cloud"
		break;
	default:
		apiUrl = "https://api.jumpsca.re"
		wcUrl = "https://wanderers.cloud"
}

class API {
	static _instance;

	static baseUrl = apiUrl;
	static wcUrl = wcUrl;
	static defaultVersion = "v1";
	static wcDefaultVersion = "v1";
	accessToken;
	wcAccessToken;
	refreshToken;
	wcRefreshToken;
	logoutMethod;


	constructor() {
		if (API._instance) {
			return API._instance;
		}
		API._instance = this;

	}

	/**
	 * Get public address information
	 * @param {string} address
	 * @returns {Promise<{}>}
	 */
	async getAddressPublic(address) {
		let res = await this.call("JR", `/address/public/${address}`);
		return {
			statusCode: res.request.status_code,
			response: res.response
		}
	}

	/**
	 * Get private address information
	 * @param {string} address
	 * @returns {Promise<{}>}
	 */
	async getAddressPrivate(address) {
		let res = await this.call("JR", `/address/private/${address}`);
		return {
			statusCode: res.request.status_code,
			response: res.response
		}
	}

	/**
	 *
	 */
	async getCheckoutSession(sessionId) {
		try {

			return await this.call("JR", `/address/checkout/session?session=${sessionId}`);
		} catch (data) {
			return data
		}
	}

	async registerAddress(address, email, years = 1, coupon = undefined) {
		return await this.call("JR", `/address/checkout/${address}`, "POST", {email, years, coupon})
	}

	async renewAddress(address, years = 1) {
		return await this.call("JR", `/address/renew/${address}`, "POST", {years})
	}

	/**
	 * Call API
	 * @param service JR/WC
	 * @param path
	 * @param method
	 * @param body
	 * @param headers
	 * @param version
	 * @returns {Promise<{request: {status_code: number, success: boolean, cat: string}, response: any}>}
	 */
	async call(service, path, method = "GET", body = null, headers = {}, version = null) {
		if (path.startsWith("/")) path = path.substring(1);
		let baseUrl;
		let token;
		switch (service) {
			case "WC":
				baseUrl = API.wcUrl;
				token = this.wcAccessToken && `Bearer ${this.wcAccessToken}`
				version = version || API.wcDefaultVersion
				break;
			default:
				baseUrl = API.baseUrl;
				token = this.accessToken && `Bearer ${this.accessToken}`
				version = version || API.defaultVersion
				break;
		}
		let url = `${baseUrl}/${version}/${path}`;
		let options = {
			method: method,
			headers: {
				...headers,
				"Content-Type": "application/json",
				"Authorization": token
			},
			body: body && JSON.stringify(body)
		}
		let response = await fetch(url, options);
		let data = await response.json();
		if (response.status >= 500) {
			//TODO: Handler
			throw data;
		}
		return data;
	}

	async getUserInfo() {
		return this.call("JR", "/user/me")
	}

	setAccessToken(token, setLoggedInState) {
		console.debug("API: AC Token updated")
		this.accessToken = token;
		(async () => {
			if (token) {
				let wcRes = await this.call("JR", "/user/wc", "POST");
				this.wcAccessToken = wcRes.response.accessToken;
				this.wcRefreshToken = wcRes.response.refreshToken;
			} else {
				this.wcAccessToken = null;
				this.wcRefreshToken = null;
			}
			let userInfo = await this.getUserInfo()
			setLoggedInState(userInfo.request.success)
		})()
	}

	setRefreshToken(token, setLoggedInState, logoutMethod, setAccessTokenState) {
		console.debug("API: RE Token updated")
		this.logoutMethod = () => {
			this.accessToken = null;
			this.refreshToken = null;
			this.wcAccessToken = null;
			this.wcRefreshToken = null;
			logoutMethod();
		}
		this.setAccessTokenState = setAccessTokenState;
		this.refreshToken = token;
		(async () => {
			await this.renewToken();
			let userInfo = await this.getUserInfo();
			setLoggedInState(userInfo.request.success)
		})()
	}

	/**
	 * Refresh access token if expired
	 * @returns {Promise<void>}
	 */
	async renewToken() {
		try {
			let accessTokenInfo = this.parseToken(this.accessToken);
			if (accessTokenInfo.expiresAt.getTime() < Date.now()) {
				let res = await this.call("JR", "/user/login/refresh", "POST", {
					accessToken: this.accessToken,
					refreshToken: this.refreshToken
				})
				let wcRes = await this.call("JR", "/user/login/refresh", "POST", {
					accessToken: this.wcAccessToken,
					refreshToken: this.wcRefreshToken
				})
				if (res.request.success && wcRes.request.success) {
					this.accessToken = res.response.accessToken;
					this.wcAccessToken = res.response.wcAccessToken;
					this.setAccessTokenState(res.response.accessToken);
				} else {
					// noinspection ExceptionCaughtLocallyJS (hello?? thats the point)
					throw new Error("oh nyo :( Refreshing failed, so token is probably expooired")
				}
			}
		} catch (e) {
			this.logoutMethod()
		}
	}

	parseToken(token) {
		// JR.RE.fz_z_MVQj8UQ3lY_UmrUjekE_2U4dn8d4WIkfHqJ7ZQRN-O1BNu6xfKINhKCrv1I.ljlioshm.ljlirzu1
		// JR.AC.fz_z_MVQj8UQ3lY_UmrUjekE_2U4dn8d4WIkfHqJ7ZQRN-O1BNu6xfKINhKCrv1I.ljlioshm.ljlirzu1
		// XX.YY.ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ.CCCCCCCC.EEEEEEEE
		// XX = JR
		// YY = REfresh or ACcess?
		// ZZ = 64 randomly generated characters from 48 random baseurl encoded bytes
		// CC = Current timestamp milliseconds encoded in base36
		// EE = Expiry timestamp milliseconds encoded in base36
		// Length without timestamps: 70
		token = token.toString();
		let tokenParts = token.split(".");
		if (tokenParts.length !== 5) throw new Error(`Invalid token: should have 5 parts but has ${tokenParts.length}`);
		// eslint-disable-next-line no-unused-vars
		let [prefixPart, typePart, randomPart, creationTimePart, expiryTimePart] = tokenParts;

		if (prefixPart !== "JR") throw new Error(`Invalid token: prefix should be JR but is ${prefixPart}`);

		if (!["RE", "AC"].includes(typePart)) throw new Error(`Invalid token: type should be RE or AC but is ${typePart}`);
		let type;
		if (typePart === "RE") type = "refresh";
		if (typePart === "AC") type = "access";

		let createdAt = new Date(parseInt(creationTimePart, 36));
		if (createdAt.toString() === "Invalid Date") throw new Error("Invalid token: invalid creation date");

		let expiresAt = new Date(parseInt(expiryTimePart, 36));
		if (expiresAt.toString() === "Invalid Date") throw new Error("Invalid token: invalid expiry date");
		if (type === "refresh" && expiryTimePart !== "0") throw new Error("Invalid token: refresh token cannot have expiry date")

		return {
			type,
			createdAt,
			expiresAt
		}
	}

	async requestLoginEmail(email) {
		return await this.call("JR", "/user/login/email", "POST", {
			email
		});
	}

	async getIp() {
		return (await this.call("JR", "/ip", "GET")).ip;
	}

	async attemptLoginEmail(email, code) {
		return await this.call("JR", "/user/login/email", "POST", {
			email,
			code
		})
	}

	async attemptLoginPassword(email, password) {
		return await this.call("JR", "/user/login/password", "POST", {
			email,
			password
		});
	}

	async changePassword(newPassword, signOutOthers) {
		return await this.call("JR", "/user/login/password", "PUT", {
			password: newPassword,
			invalidateSessions: signOutOthers
		})
	}


}

let api = new API();

export default api;