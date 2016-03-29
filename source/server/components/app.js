import config from '../config/config';
import { Routes } from './routes';

let mongoose = require('mongoose');
let server = require('http').createServer();
let sio = require('socket.io')(server);

class App {
    constructor(){
        this.routes = new Routes(sio);
    }

    start (){
        mongoose.connect(config.mongo.uri, config.mongo.options);
        server.listen(config.server.port);

        return new Promise(resolve => setTimeout( () => resolve()), 1500);
    }

    stop(){
        mongoose.disconnect();
        sio.close();

        return new Promise(resolve => setTimeout( () => resolve()), 1500);
    }


}

let app = new App();

export default app;