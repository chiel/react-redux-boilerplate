'use strict';

const gulp = require('gulp');

/**
 * Symlink app into node_modules
 */
gulp.task('symlink', [ 'babel' ], () => {
	const symlink = require('gulp-symlink');

	const appStream = gulp.src('dist/app')
		.pipe(symlink('node_modules/app', { force: true }));

	const modStream = gulp.src('dist/modules/*')
		.pipe(symlink(file => (
			new symlink.File({
				path: `dist/app/${file.relative}`,
				cwd: process.cwd()
			})
		), { force: true }));

	return require('merge-stream')(appStream, modStream);
});
