'use strict';

import * as c from 'app/constants';

const initialState = {
	token: null,
	user:  null
};

/**
 * Session reducer
 *
 * @param {Object} state
 * @param {Object} action
 *
 * @return {Object}
 */
export function session(state = initialState, action) {
	switch (action.type) {
		case c.SET_SESSION_TOKEN:
			return { ...state,
				token: action.token
			};

		case c.SET_SESSION_USER:
			return { ...state,
				user: action.user
			};

		default:
			return state;
	}
}
