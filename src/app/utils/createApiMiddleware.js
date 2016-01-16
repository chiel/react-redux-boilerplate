'use strict';

export default function createApiMiddleware(callApiWithToken) {
	return function apiMiddleware({ dispatch, getState }) {
		return next => action =>
			typeof action === 'function' ?
				action(dispatch, getState, callApiWithToken) :
				next(action);
	};
}
