'use strict';

import routes               from './routes';
import bundles              from 'app/bundles';
import App                  from 'app/components/App';
import * as sessionReducers from 'app/reducers/session';
import createApiCaller      from 'app/utils/createApiCaller';
import createApiMiddleware  from 'app/utils/createApiMiddleware';
import createCustomStore    from 'app/utils/createCustomStore';
import renderFullPage       from 'app/utils/renderFullPage';
import express              from 'express';
import createMemoryHistory  from 'history/lib/createMemoryHistory';
import React                from 'react';
import { renderToString }   from 'react-dom/server';
import { Provider }         from 'react-redux';
import { match,
         RoutingContext }   from 'react-router';
import { combineReducers }  from 'redux';

const app = express();
app.use(require('compression')());
app.use(require('serve-static')(__dirname + '/../public'));
app.use(require('cookie-parser')());

app.get('*', (req, res, next) => {
	let bundle = req.path.replace(/^[\/\s]+/, '').split('/')[0];
	if (bundles[bundle] && bundles[bundle].partOf) {
		bundle = bundles[bundle].partOf;
	}

	let reducers = { ...sessionReducers };

	const styleSheets = [];
	if (bundles[bundle]) {
		if (bundles[bundle].styles) {
			styleSheets.push(`/css/${bundle}.css`);
		}

		if (bundles[bundle].reducers) {
			reducers = { ...reducers, ...require(`app/${bundle}/reducers`) };
		}
	}

	const history = createMemoryHistory();

	const store = createCustomStore(
		combineReducers(reducers),
		[ createApiMiddleware(createApiCaller(req.cookies.api_token), history) ]
	);

	match({ routes, location: req.url, history }, (err, redirectLocation, renderProps) => {
		if (err) {
			return next(err);
		}

		if (redirectLocation) {
			return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
		}

		const render = () => (
			res.send(renderFullPage(renderToString(
				<Provider store={store}>
					<RoutingContext { ...renderProps } />
				</Provider>
			), store.getState(), styleSheets))
		);

		const promises = renderProps.components
			.filter(component => component && !!component.fetchData)
			.map(component => component.fetchData(renderProps, store.dispatch));

		if (!promises.length) {
			return render();
		}

		Promise.all(promises)
			.then(render)
			.catch(next);
	});
});

const port = process.env.PORT || 4589;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
