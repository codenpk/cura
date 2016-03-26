'use strict';

let gulp = require('gulp');
let webpack = require('webpack');
let config = require('./tools/webpack.server.config');

gulp.task('build:server', (cb) => {
   webpack(config).run( (err, stats) => {
       if (err) console.log(`Error ${err}`);
       else console.log(stats.toString());
       cb();
   });
});