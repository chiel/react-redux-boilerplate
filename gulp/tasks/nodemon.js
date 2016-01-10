'use strict';

const gulp  = require('gulp');
const gutil = require('gulp-util');
const c     = gutil.colors;

/**
 * Development server
 */
gulp.task('nodemon', [ 'babel' ], (cb) => {
	const nodemon = require('nodemon');

	nodemon({
		script: './dist/server/index.js',
		watch: './dist'
	})
	.once('start', cb)
	.on('start', () => {
		gutil.log(`${c.cyan('nodemon')}: started`);
	})
	.on('restart', (files) => {
		gutil.log(`${c.cyan('nodemon')}: ${c.yellow(files[0].replace(__dirname + '/', ''))} changed - restarting`);
	})
});

