'use strict';

import routes               from './routes';
import App                  from 'app/components/App';
import createReducer        from 'app/reducers';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import React                from 'react';
import ReactDOM             from 'react-dom';
import { match, Router }    from 'react-router';
import { Provider }         from 'react-redux';
import { createStore }      from 'redux';

const history = createBrowserHistory();
const store   = createStore(createReducer(), window.__initialState);

history.listen(location => {
	match({ routes, location: location.pathname }, (err, redirectLocation, renderProps) => {
		ReactDOM.render((
			<Provider store={store}>
				<Router routes={routes} history={history} />
			</Provider>
		), document.getElementById('app-root'));
	});
})();
