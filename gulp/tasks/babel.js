'use strict';

const gulp  = require('gulp');
const gutil = require('gulp-util');
const c     = gutil.colors;

gulp.task('babel', () => {
	const babel = require('gulp-babel');
	const del   = require('del');
	const src   = [
		'src/**/*.{js,jsx}',
		'!src/client/*.{js,jsx}'
	];

	const run = (e, path) => {
		let runSrc = src;

		// If this function was triggered by a watch we only need
		// to transform the changed files. If a file was deleted we
		// need to delete the corresponding transformed file
		if (e) {
			runSrc = e.path.replace(process.cwd() + '/', '');

			if (e.type === 'deleted') {
				return del(runSrc.replace(/^src/, 'dist'));
			}

			gutil.log(`${c.cyan('babel')}: ${c.yellow(runSrc)} ${e.type}, converting`);
		} else {
			gutil.log(`${c.cyan('babel')}: converting`);
		}

		return gulp.src(runSrc, { base: 'src' })
			.pipe(babel())
			.pipe(gulp.dest('dist'));
	}

	if (gutil.env.dev) {
		gutil.log(`${c.cyan('babel')}: watching`);
		gulp.watch(src, run);
	}

	return run();
});
