'use strict';

const gulp  = require('gulp');
const gutil = require('gulp-util');
const c     = gutil.colors;

/**
 * Bundle scripts for browser usage
 */
gulp.task('scripts', () => {
	const browserify = require('browserify');

	const bundleOpts = {
		debug: true,
		extensions: [ '.jsx' ],
		transform: [ require('babelify') ]
	};

	// app bundler
	let appBundler = browserify('src/client', bundleOpts);

	// expose app modules
	exposeDir(appBundler, './src/app', 'app');

	// this will hold all bundlers and their outputs
	let bundlers  = [ appBundler ];
	const outputs = [ 'app.js' ];

	// create bundlers for each module, excluding modules found in the app bundler
	// these don't have entry points since the files are just `require()`d
	const inputs = require('globby').sync('./src/modules/*');
	let moduleBundler, moduleName;
	inputs.forEach(input => {
		moduleName = input.match(/\/([^\/]+)$/)[1];

		moduleBundler = browserify(bundleOpts).external(appBundler);
		exposeDir(moduleBundler, input, `app/${moduleName}`);

		bundlers.push(moduleBundler);
		outputs.push(`${moduleName}.js`);
	});

	// wrap the app bundle with watchify in dev mode
	if (gutil.env.dev) {
		gutil.log(`${c.cyan('scripts')}: watching`);

		bundlers = bundlers.map((bundler, index) => {
			bundler = require('watchify')(bundler);
			bundler.on('update', files => {
				run(bundler, outputs[index], files);
			});
			return bundler;
		});
	}

	return require('merge-stream')(
		bundlers.map((bundle, index) => run(bundle, outputs[index]))
	);
});

/**
 * Recursively expose a directory on given bundler
 *
 * @param {Object} bundler
 * @param {String} dir
 * @param {String} namespace
 */
function exposeDir(bundler, dir, namespace) {
	const fs = require('fs');

	fs.readdirSync(dir).forEach(file => {
		if (/^\./.test(file)) return;

		if (fs.statSync(`${dir}/${file}`).isDirectory()) {
			return exposeDir(bundler, `${dir}/${file}`, `${namespace}/${file}`);
		}

		const m = file.match(/^(.*)\.jsx?$/);
		if (!m) return;

		const exposeAs = m[1] === 'index' ? namespace : `${namespace}/${m[1]}`;
		bundler.require(`${dir}/${file}`, { expose: exposeAs });
	});
}

/**
 * Bundle given bundler
 *
 * @param {Object} bundler
 * @param {String} bundleName
 * @param {Array} files
 */
function run(bundler, bundleName, files) {
	const sourcemaps = require('gulp-sourcemaps');

	if (files) {
		gutil.log(`${c.cyan('scripts')}: ${c.yellow(files[0].replace(process.cwd(), '.'))}  changed - bundling ${c.yellow(bundleName)}`);
	} else {
		gutil.log(`${c.cyan('scripts')}: bundling ${c.yellow(bundleName)}`);
	}

	return bundler.bundle()
		.pipe(require('vinyl-source-stream')(bundleName))
		.pipe(require('vinyl-buffer')())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(gutil.env.dev ?  gutil.noop() : require('gulp-uglify')())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/public/js'));
}
