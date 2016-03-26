'use strict';

let gulp = require('gulp');
let webpack = require('webpack');
let config = require('./tools/webpack.server.config');
let del = require('del');

gulp.task('clean', () => {
    return del(['./dist']);
});

gulp.task('build:server', ['clean'], (cb) => {
   webpack(config).run( (err, stats) => {
       if (err) console.log(`Error ${err}`);
       else console.log(stats.toString());
       cb();
   });
});