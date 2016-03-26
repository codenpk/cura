import { config } from './config';

let mongoose = require('mongoose');
mongoose.connect(config.mongo.uri, config.mongo.options);

let server = require('socket.io')();

server.listen(3000, () => {
    console.log('Socket.io server is listening');
});