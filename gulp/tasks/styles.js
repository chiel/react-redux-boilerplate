'use strict';

const gulp  = require('gulp');
const gutil = require('gulp-util');
const c     = gutil.colors;

gulp.task('styles', () => {
	const src = [
		'src/client/styles/index.scss',
		'src/modules/*/styles/index.scss'
	];

	if (gutil.env.dev) {
		gutil.log(`${c.cyan('styles')}: watching`);

		require('globby').sync(src).forEach(src => {
			gulp.watch([
				src.replace(/([^\/]+)\.scss$/, '*.scss'),
				src.replace(/([^\/]+)\.scss$/, '**/*.scss')
			], e => run(src, e));
		});
	}

	return run(src);
});

function run(src, e) {
	const sourcemaps = require('gulp-sourcemaps');

	if (e) {
		gutil.log(`${c.cyan('styles')}: ${c.yellow(e.path.replace(process.cwd(), '.'))} ${e.type}, processing`);
	} else {
		gutil.log(`${c.cyan('styles')}: processing`);
	}

	return gulp.src(src, { base: 'src' })
		.pipe(sourcemaps.init())
		.pipe(require('gulp-sass')())
		.pipe(require('gulp-autoprefixer')({
			browsers: [ 'last 2 versions' ]
		}))
		.pipe(gutil.env.dev ? gutil.noop() : require('gulp-cssnano')({
			zindex: false
		}))
		.pipe(require('gulp-rename')(path => {
			const m = path.dirname.match(/^modules\/([^\/]+)/);
			path.basename = m ? m[1] : 'app';
			path.dirname  = '';
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/public/css'));
};
