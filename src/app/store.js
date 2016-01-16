'use strict';

import createReducer       from 'app/reducers';
import createApiCaller     from 'app/utils/createApiCaller';
import createApiMiddleware from 'app/utils/createApiMiddleware';
import createCustomStore   from 'app/utils/createCustomStore';

const apiToken = window.__initialState.session.token;

const store = createCustomStore(
	createReducer(),
	[ createApiMiddleware(createApiCaller(apiToken)) ],
	window.__initialState
);

export default store;
