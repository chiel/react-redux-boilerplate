'use strict';

import bundles          from 'app/bundles';
import App              from 'app/components/App';
import createReducer, {
         addReducers }  from 'app/reducers';
import loadCSS          from 'fg-loadcss';
import loadJS           from 'fg-loadjs';

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

	if (bundles[bundle].styles) {
		const sheets = document.styleSheets;
		let found = false;

		for (let i = 0; i < sheets.length; i++) {
			if (!sheets[i].href) continue;

			if (new RegExp(`\/css\/${bundle}\.css`).test(sheets[i].href)) {
				found = true;
				break;
			}
		}

		if (!found) {
			loadCSS(`/css/${bundle}.css`);
		}
	}

	loadJS(`/js/${bundle}.js`, function() {
		loaded.push(bundle);

		if (bundles[bundle].reducers) {
			addReducers(require(`app/${bundle}/reducers`));
			require('app/store').default.replaceReducer(createReducer());
		}
		cb(null, require(`app/${bundle}/routes`).default);
	});
}

export default routes;
