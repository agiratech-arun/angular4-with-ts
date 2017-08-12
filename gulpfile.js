"use strict";
const gulp = require('gulp');
const del = require('del');
const tsc = require('gulp-typescript');
// const sourcemaps = require('gulp-sourcemaps');
const tsProject = tsc.createProject('tsconfig.json');
const tslint = require('gulp-tslint');

/**
 * To delete existing build
 */

gulp.task('clean', function () {
  return del(['build']);
});

/**
 * Lint all custom TypeScript files.
 */

gulp.task('tslint', function () {
  // const program = tslint('./tsconfig.json');
  return gulp.src('src/**/*.ts')
    .pipe(tslint()) // contains rules in the tslint.json
    .pipe(tslint.report());
});

/**
 * cmopile ts files to js and store them in dest folder
 */

gulp.task('compile', ['tslint'], function () {
  return gulp.src('src/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest('build/'));
});

/**
 * copy all non typescript files into build folder
 */

gulp.task('resource', function () {
  gulp.src(['src/**/*', '!**/*.ts',''])
    .pipe(gulp.dest('build/'));
})

/**
 * move all needed lib files into build
 */

gulp.task('libs', () => {
  return gulp.src([
    'core-js/client/shim.min.js',
    'systemjs/dist/system-polyfills.js',
    'systemjs/dist/system.src.js',
    'reflect-metadata/Reflect.js',
    'rxjs/**/*.js',
    'zone.js/dist/**',
    '@angular/**/bundles/**'
  ], { cwd: 'node_modules/**' }) /* Glob required here. */
    .pipe(gulp.dest('build/lib'));
});

/**
 * Watch for changes in TypeScript, HTML and CSS files.
 */
gulp.task('watch', function () {
  gulp.watch(['src/**/*.ts'], ['compile']).on('change', function (e) {
    console.log('TypeScript file ' + e.path + ' has been changed. Compiling.');
  });
  gulp.watch(['src/**/*.html', 'src/**/*.css'], ['resources']).on('change', function (e) {
    console.log('Resource file ' + e.path + ' has been changed. Updating.');
  });
});

/**
 * Build the project.
 */
gulp.task('build', ['clean','compile', 'resource', 'libs'], () => {
  console.log('Building the project ...');
});
