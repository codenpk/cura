var fs = require('fs');
var path = require('path');

var nodeModules = fs.readdirSync('node_modules')
    .filter(x => {
        return ['.bin'].indexOf(x) === -1;
    });

module.exports = {
    entry: path.resolve(__dirname,'../source/server/bootstrap.js'),
    target: 'node',
    output: {
        path: path.resolve(__dirname, '../dist/server'),
        filename: "server.js"
    },

    externals : [
        function (context, request, callback) {
            var pathStart = request.split('/')[0];
            if (nodeModules.indexOf(pathStart) >= 0) {
                return callback(null, "commonjs " + request);
            }
            callback();
        }
    ], // ensures we keep any commonJs require statements to node modules in (i.e. don't bundle node modules).

    module: {
        loaders: [

            // load and compile javascript
            { test: /\.js$/, exclude: /node_modules/, loader:"babel" }
        ]
    }
};