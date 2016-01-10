'use strict';

const globby = require('globby');
const gulp   = require('gulp');
const gutil  = require('gulp-util');

globby.sync(__dirname + '/tasks/*.js').forEach(task => require(task));

const defaultTasks = [ 'babel', 'scripts', 'symlink' ];
if (gutil.env.dev) {
	defaultTasks.push('nodemon');
}

gulp.task('default', defaultTasks);
