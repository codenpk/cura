'use strict';
var HtmlWebpackPlugin = require('html-webpack-plugin');
var Webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: [
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:8000',
        path.resolve(__dirname, '../source/website/bootstrap.js')],
    output: {
        path: path.resolve(__dirname, '../dist/website'),
        filename: "bundle.js"
    },

    module: {
        loaders: [

            // load and compile javascript
            {test: /\.js$/, exclude: /node_modules/, loader: "babel"},

            // load css and process less
            {test: /\.less$/, loader: "raw!less"},

            // load JSON files and HTML
            {test: /\.json$/, loader: "json"},
            {test: /\.html$/, exclude: /node_modules/, loader: "raw"},

            {
                test: /\.svg$/,
                loader: 'svg-inline'
            }
        ]
    },

    // inject js bundle to index.html
    plugins: [
        new HtmlWebpackPlugin({template: path.resolve(__dirname, '../source/website/index.html'), minify: false}),
        new Webpack.HotModuleReplacementPlugin()
    ],

    // support source maps
    devtool: "source-map"
};