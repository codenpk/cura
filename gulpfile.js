'use strict';

let gulp = require('gulp');
let webpack = require('webpack');
let WebpackDevServer = require('webpack-dev-server');
let babel = require('gulp-babel');
let nodemon = require('nodemon');
let path = require('path');
let gulpJasmine = require('gulp-jasmine');
let del = require('del');

//region server and shared
gulp.task('clean:shared', () => {
    return del(['./dist/shared']);
});

gulp.task('clean:server', () => {
    return del(['./dist/server']);
});

gulp.task('build:shared', ['clean:shared'], () => {
    return gulp.src(['./source/shared/**/*.js'])
        .pipe(babel({
            presets: ['es2015'],
            plugins: ['transform-decorators-legacy']
        }))
        .pipe(gulp.dest('./dist/shared'));
});

gulp.task('test:shared', ['build:shared'], () => {
    return gulp.src('./dist/shared/**/*.spec.js')
        .pipe(gulpJasmine());
});

gulp.task('build:server', ['clean:server', 'build:shared'], () => {
    return gulp.src(['./source/server/**/*.js'])
        .pipe(babel({
            presets: ['es2015'],
            plugins: ['transform-decorators-legacy']
        }))
        .pipe(gulp.dest('./dist/server'));
});

gulp.task('start:server', ['build:server'], () => {
    nodemon({
        execMap : {
            js: 'node'
        },
        script: path.join(__dirname, "dist/server/bootstrap"),
        ignore: ['*']
    });
});

gulp.task('restart:server', ['build:server'], () => {
    nodemon.restart();
});

gulp.task('test:server', ['build:server'], () => {
    process.env.NODE_ENV = 'test';

    return gulp.src('./dist/server/**/*.spec.js')
        .pipe(gulpJasmine());
});

gulp.task('test', ['build:shared', 'build:server'], () => {
    return gulp.src('./dist/**/*.spec.js')
        .pipe(gulpJasmine());
});

gulp.task('run:server',['start:server'], () => {
   gulp.watch(['./source/server/**/*.js','!./source/server/**/*.spec.js'], ['restart:server']);
});
//endregion

gulp.task('clean:website', () => {
    return del(['./dist/website']);
});

gulp.task('build:website', ['clean:website'], (cb) => {
    webpack(require('./tools/webpack.dev.config')).run((err) => {
        if (err) {
            console.log('Error', err);
        }

        if (cb) {
            cb();
        }
    });
});

gulp.task('run:website', () => {
    let compiler = webpack(require('./tools/webpack.dev.config'));

    let server = new WebpackDevServer(compiler, {
        historyApiFallback: true,
        hot: true,
        watchOptions: {
            aggregateTimeout: 200,
            poll: 1000
        },
        open: true,
        contentBase: path.resolve(__dirname, "./source/website")
    });

    server.listen(8000, 'localhost');
});
