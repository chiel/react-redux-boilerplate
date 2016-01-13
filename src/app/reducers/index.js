'use strict';

import { session }         from 'app/reducers/session';
import { combineReducers } from 'redux';

let reducers = { session };

export function addReducers(newReducers) {
	reducers = { ...reducers, ...newReducers };
}

export default function createReducer() {
	return combineReducers(reducers);
}
