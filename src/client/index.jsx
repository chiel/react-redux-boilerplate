'use strict';

import routes            from './routes';
import App               from 'app/components/App';
import history           from 'app/history';
import React             from 'react';
import ReactDOM          from 'react-dom';
import { match, Router } from 'react-router';
import { Provider }      from 'react-redux';

history.listen(location => {
	match({ routes, location: location.pathname }, (err, redirectLocation, renderProps) => {
		ReactDOM.render((
			<Provider store={require('app/store').default}>
				<Router routes={routes} history={history} />
			</Provider>
		), document.getElementById('app-root'));
	});
})();
