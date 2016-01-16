'use strict';

import callApi from 'app/utils/callApi';

/**
 * Create an api calling function with given token
 *
 * If a token is passed into this function, the api calls will receive
 * an Authorization header; if not, the calls will be unauthorized.
 *
 * @param {String} token
 *
 * @return {Function}
 */
export default function createApiCaller(token) {
	if (!token) return callApi;

	/**
	 * Wrap callApi to mix the Authorization header with the token into
	 * the request's options. Takes the same arguments as `callApi`
	 *
	 * @param {String} endpoint
	 * @param {Object} options
	 */
	return function callApiWithToken(endpoint, options) {
		if (!options) options = {};

		const headers = options.headers || {};

		return callApi(endpoint, { ...options,
			headers: { ...headers,
				Authorization: `Bearer ${token}`
			}
		});
	};
}
