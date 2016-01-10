'use strict';

import App                from 'app/components/App';
import renderFullPage     from 'app/utils/renderFullPage';
import express            from 'express';
import React              from 'react';
import { renderToString } from 'react-dom/server';

const app = express();
app.use(require('compression')());
app.use(require('serve-static')(__dirname + '/../public'));

app.get('/', (req, res, next) => {
	res.send(renderFullPage(renderToString(
		<App />
	)));
});

const port = process.env.PORT || 4589;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
