'use strict';

import { session }         from 'app/reducers/session';
import { combineReducers } from 'redux';

const reducers = { session };

export default function createReducer() {
	return combineReducers(reducers);
}
