'use strict';

import { applyMiddleware,
         createStore }    from 'redux';

/**
 * Create a store with given reducer, middleware and initial state
 *
 * @param {Function} reducer
 * @param {Function[]} middleware
 * @param {Object} initialState
 */
export default function createCustomStore(reducer, middleware, initialState) {
	return applyMiddleware(...middleware)(createStore)(reducer, initialState);
}
