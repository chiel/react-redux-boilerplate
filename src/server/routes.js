'use strict';

import App    from 'app/components/App';
import globby from 'globby';

const moduleRoutes = globby.sync(`${__dirname}/../modules/*/routes.js`)
	.map(routesFile => require(routesFile).default);

const routes = moduleRoutes.map(routes => ({ childRoutes: routes }));

routes.push({
	path: '*',
	component: App
});

export default routes;
