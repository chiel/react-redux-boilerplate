'use strict';

const gulp  = require('gulp');
const gutil = require('gulp-util');
const c     = gutil.colors;

/**
 * Pull images through imagemin
 */
gulp.task('images', function() {
	const src = [
		'src/client/images/*.{gif,jpg,png,svg}',
		'src/client/images/**/*.{gif,jpg,png,svg}',
		'src/modules/*/images/*.{gif,jpg,png,svg}',
		'src/modules/*/images/**/*.{gif,jpg,png,svg}'
	];

	if (gutil.env.dev) {
		gutil.log(`${c.cyan('images')}: watching`);
		gulp.watch(src, e => run(src, e));
	}

	return run(src);
});

function run(src, e) {
	if (e) {
		src = e.path.replace(`${process.cwd()}/`, '');
		gutil.log(`${c.cyan('images')}: ${c.yellow(src)} ${e.type}, minifying`);
	} else {
		gutil.log(`${c.cyan('images')}: minifying`);
	}

	return gulp.src(src, { base: 'src' })
		.pipe(require('gulp-rename')(path => {
			const m = path.dirname.match(/^modules\/([^\/]+)/);
			path.dirname = m ?
				path.dirname.replace(`${m[0]}/images`, m[1]) :
				path.dirname.replace('client/images', 'app');
		}))
		.pipe(require('gulp-imagemin')())
		.pipe(gulp.dest('dist/public/img'));
};
