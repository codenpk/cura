import { config } from '../config';
import { Routes } from './routes';

let mongoose = require('mongoose');
let sio = require('socket.io')();

class Server {
    constructor(){
        this.routes = new Routes(sio);
    }

    open (){
        mongoose.connect(config.mongo.uri, config.mongo.options);
        sio.listen(3000, () => { });
    }

    close(){
        mongoose.disconnect();
        sio.close(() => {
            console.log("CALLBACK DONE!");
        });
    }
}

let server = new Server();

export default server;