'use strict';

/**
 * Render given html string into full page markup
 *
 * @param {String} html
 * @param {Object} initialState
 * @param {String[]} styleSheets
 *
 * @return {String}
 */
export default function renderFullPage(html, initialState, styleSheets) {
	styleSheets = styleSheets.map(sheet => (
		`<link rel="stylesheet" href="${sheet}">`
	));

	return (
`<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="x-ua-compatible" content="ie=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<title>React + Redux boilerplate</title>
		<link rel="stylesheet" href="/css/app.css">
		${styleSheets}
	</head>
	<body>
		<div id="app-root">${html}</div>
		<script>window.__initialState = ${JSON.stringify(initialState)};</script>
		<script src="/js/app.js"></script>
	</body>
</html>`
	);
}
