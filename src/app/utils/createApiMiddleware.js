'use strict';

export default function createApiMiddleware(callApiWithToken, history) {
	return function apiMiddleware({ dispatch, getState }) {
		return next => action =>
			typeof action === 'function' ?
				action(dispatch, getState, callApiWithToken, history) :
				next(action);
	};
}
