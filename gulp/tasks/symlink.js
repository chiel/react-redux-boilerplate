'use strict';

const gulp = require('gulp');

/**
 * Symlink app into node_modules
 */
gulp.task('symlink', [ 'babel' ], () => {
	const symlink = require('gulp-symlink');

	return gulp.src('dist/app')
		.pipe(symlink('node_modules/app', { force: true }));
});
