import config from '../config';
import { Routes } from './routes';

let mongoose = require('mongoose');
let sio = require('socket.io')();

class App {
    constructor(){
        this.routes = new Routes(sio);

        this.start();
    }

    start (){
        mongoose.connect(config.mongo.uri, config.mongo.options);
        sio.listen(3000, () => { });
    }

    stop(){
        mongoose.disconnect();
        sio.close();
    }


}

let app = new App();

export default app;