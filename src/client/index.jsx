'use strict';

import routes               from './routes';
import App                  from 'app/components/App';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import React                from 'react';
import ReactDOM             from 'react-dom';
import { Router }           from 'react-router';

ReactDOM.render((
	<Router routes={routes} history={createBrowserHistory()} />
), document.getElementById('app-root'));
