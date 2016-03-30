'use strict';

let gulp = require('gulp');
let webpack = require('webpack');
let babel = require('gulp-babel');
let gulpJasmine = require('gulp-jasmine');
let del = require('del');

gulp.task('clean', () => {
    return del(['./dist']);
});

gulp.task('build:server', ['clean'], () => {
    return gulp.src(['./source/server/**/*.js'])
        .pipe(babel({
            presets: ['es2015'],
            plugins: ['transform-decorators-legacy']
        }))
        .pipe(gulp.dest('./dist/server'));
});

gulp.task('test:server', ['build:server'], () => {
   return gulp.src('./dist/server/**/*.spec.js')
       .pipe(gulpJasmine());
});