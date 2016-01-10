'use strict';

import App                from 'app/components/App';
import express            from 'express';
import React              from 'react';
import { renderToString } from 'react-dom/server';

const app = express();

app.get('/', (req, res, next) => {
	res.send(renderToString(
		<App />
	));
});

const port = process.env.PORT || 4589;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
