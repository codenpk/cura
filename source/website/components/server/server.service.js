'use strict';
import * as io          from 'socket.io-client';
import config           from '../../config/config';
import { BehaviorSubject } from 'rxjs/subject/BehaviorSubject';

export class ServerService {
    constructor(){
        this.connections = {};
        this.status = new BehaviorSubject('online');
    }

    connect(namespace) {
        this.connections[namespace] = io.connect(`${config.server.uri}/${namespace}`, { reconnection : false });

        this.authenticate(namespace);

        this.connections[namespace].on('connect_error', () => {
            this.status.next('offline');
        });

        return this.connections[namespace];
    }

    authenticate(namespace) {
        this.connections[namespace].emit('authenticate', this.token);
    }

    get token() {
        return localStorage.getItem('token');
    }

    set token(value) {
        if (typeof (value) === 'undefined' || value === null) {
            localStorage.removeItem('token');
        } else {
            localStorage.setItem('token', value);
        }
    }
}