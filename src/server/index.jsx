'use strict';

import routes               from './routes';
import bundles              from 'app/bundles';
import App                  from 'app/components/App';
import * as sessionReducers from 'app/reducers/session';
import renderFullPage       from 'app/utils/renderFullPage';
import express              from 'express';
import React                from 'react';
import { renderToString }   from 'react-dom/server';
import { Provider }         from 'react-redux';
import { match,
         RoutingContext }   from 'react-router';
import { combineReducers,
         createStore }      from 'redux';

const app = express();
app.use(require('compression')());
app.use(require('serve-static')(__dirname + '/../public'));

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

	const store = createStore(combineReducers(reducers));

	match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
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
