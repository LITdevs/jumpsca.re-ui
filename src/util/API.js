class API {
	static _instance;

	static baseUrl = "http://localhost:18665"
	static defaultVersion = "v1"
	token


	constructor() {
		if (API._instance) {
			return API._instance;
		}
		API._instance = this;

	}

	/**
	 * Get address information
	 * @param {string} address
	 * @returns {Promise<{}>}
	 */
	async getAddress(address) {
		let res = await this.call(`/address/${address}`);
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

			return await this.call(`/address/checkout/session?session=${sessionId}`);
		} catch (data) {
			return data
		}
	}

	async registerAddress(address) {
		return await this.call(`/address/checkout/${address}`, "POST")
	}

	/**
	 * Call API
	 * @param path
	 * @param method
	 * @param body
	 * @param headers
	 * @param version
	 * @returns {Promise<{request: {status_code: number, success: boolean, cat: string}, response: any}>}
	 */
	async call(path, method = "GET", body = null, headers = {}, version = API.defaultVersion) {
		if (path.startsWith("/")) path = path.substring(1);
		let url = `${API.baseUrl}/${version}/${path}`;
		let options = {
			method: method,
			headers: {
				...headers,
				"Content-Type": "application/json",
				"Authorization": this.token && `Bearer ${this.token}`
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
}

let api = new API();

export default api;