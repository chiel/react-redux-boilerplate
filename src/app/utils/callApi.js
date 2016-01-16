'use strict';

require('isomorphic-fetch');

import * as errors from 'app/errors';

const API_URL = typeof window !== 'undefined' ?
	window.__config.API_URL :
	process.env.API_URL;

/**
 * Call given api endpoint with given options
 *
 * This is a lightweight wrapper around fetch that sets content-type and
 * accept headers if they've not been defined yet and does some standard
 * error handling that should always be implemented.
 *
 * @param {String} endpoint
 * @param {Object} options
 *
 * @return {Promise}
 */
export default function callApi(endpoint, options) {
	const url = API_URL + endpoint;

	options = options || {};
	options.headers = options.headers || {};

	if (!options.headers.accept) {
		options.headers.accept = 'application/json';
	}

	if (!options.headers['content-type']) {
		options.headers['content-type'] = 'application/json';
	}

	return fetch(url, options)
		.then(res => {
			if (res.status >= 200 && res.status < 300) {
				return res.json();
			} else if (res.status === 401) {
				return res.json().then(json => (
					Promise.reject(new errors.Authorization(json.error.message))
				));
			}
		});
}
