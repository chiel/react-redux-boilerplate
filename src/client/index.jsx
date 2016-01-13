'use strict';

import routes               from './routes';
import App                  from 'app/components/App';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import React                from 'react';
import ReactDOM             from 'react-dom';
import { match, Router }    from 'react-router';
import { Provider }         from 'react-redux';

const history = createBrowserHistory();

history.listen(location => {
	match({ routes, location: location.pathname }, (err, redirectLocation, renderProps) => {
		ReactDOM.render((
			<Provider store={require('app/store').default}>
				<Router routes={routes} history={history} />
			</Provider>
		), document.getElementById('app-root'));
	});
})();
