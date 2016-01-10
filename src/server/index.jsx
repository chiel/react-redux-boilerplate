'use strict';

import routes             from './routes';
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
	match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
		if (err) {
			return next(err);
		}

		if (redirectLocation) {
			return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
		}

		res.send(renderFullPage(renderToString(
			<RoutingContext { ...renderProps } />
		)));
	});
});

const port = process.env.PORT || 4589;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
