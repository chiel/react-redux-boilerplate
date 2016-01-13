'use strict';

import routes             from './routes';
import bundles            from 'app/bundles';
import App                from 'app/components/App';
import renderFullPage     from 'app/utils/renderFullPage';
import express            from 'express';
import React              from 'react';
import { renderToString } from 'react-dom/server';
import { match,
         RoutingContext } from 'react-router';

const app = express();
app.use(require('compression')());
app.use(require('serve-static')(__dirname + '/../public'));

app.get('*', (req, res, next) => {
	let bundle = req.path.replace(/^[\/\s]+/, '').split('/')[0];
	if (bundles[bundle] && bundles[bundle].partOf) {
		bundle = bundles[bundle].partOf;
	}

	const styleSheets = [];
	if (bundles[bundle] && bundles[bundle].styles) {
		styleSheets.push(`/css/${bundle}.css`);
	}

	match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
		if (err) {
			return next(err);
		}

		if (redirectLocation) {
			return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
		}

		res.send(renderFullPage(renderToString(
			<RoutingContext { ...renderProps } />
		), styleSheets));
	});
});

const port = process.env.PORT || 4589;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
