'use strict';

let gulp = require('gulp');
let webpack = require('webpack');
let babel = require('gulp-babel');
let config = require('./tools/webpack.server.config');
let jasmine = require('gulp-jasmine');
let del = require('del');

gulp.task('clean', () => {
    return del(['./dist']);
});

gulp.task('build:server', ['clean'], (cb) => {
   // webpack(config).run( (err, stats) => {
   //     if (err) console.log(`Error ${err}`);
   //     else console.log(stats.toString());
   //     cb();
   // });
    return gulp.src(['./source/server/**/*.js'])
        .pipe(babel({
            presets: ['es2015'],
            plugins: ['transform-decorators-legacy']
        }))
        .pipe(gulp.dest('./dist/server'));
});

gulp.task('test:server', ['build:server'], () => {
   return gulp.src('./dist/server/**/*.spec.js')
       .pipe(jasmine());
});


gulp.task('dev:build', ['test:server'], () => {
   gulp.watch(['./dist/server/server.js','./source/server/**/*.spec.js'], ['test:server']);
});