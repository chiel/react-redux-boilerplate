'use strict';

import express from 'express';

const app = express();

app.get('/', (req, res, next) => {
	res.send('Hello world.');
});

const port = process.env.PORT || 4589;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
