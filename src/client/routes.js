'use strict';

import bundles from 'app/bundles';
import App     from 'app/components/App';
import loadJS  from 'fg-loadjs';

const routes = [
	{
		getChildRoutes: getChildRoutes
	},
	{
		path: '*',
		component: App
	}
];

const loaded = [];

function getChildRoutes(location, cb) {
	let bundle = location.pathname.replace(/^[\/\s]+/, '').split('/')[0];
	if (!bundle || !bundles[bundle]) return cb();

	if (bundles[bundle].partOf) {
		bundle = bundles[bundle].partOf;
	}

	if (loaded.indexOf(bundle) !== -1) {
		return cb(null, require(`app/${bundle}/routes`).default);
	}

	loadJS(`/js/${bundle}.js`, function() {
		loaded.push(bundle);
		cb(null, require(`app/${bundle}/routes`).default);
	});
}

export default routes;
