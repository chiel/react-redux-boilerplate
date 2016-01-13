'use strict';

import createReducer   from 'app/reducers';
import { createStore } from 'redux';

const store = createStore(createReducer(), window.__initialState);

export default store;
