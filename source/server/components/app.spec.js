'use strict';
import config from '../config/config';
import app from './app';

describe('app', () => {
    beforeAll((cb) => {
       app.start().then( () => cb());
    });

    afterAll((cb) => {
        app.stop().then( () => cb());
    });

    it('allows a correct connection', (done) => {
        let socket = require('socket.io-client')(config.server.uri);

        socket.on('connect', () => {
            socket.disconnect(true);
            done();
        });

        socket.on('connect_failed', () => {
            socket.disconnect(true);
            fail('Connection failed');
            done();
        });
    });

    it('refuses a random connection', (done) => {
        let socket = require('socket.io-client')('http://localhost:3003');

        socket.on('connect', () => {
            socket.disconnect(true);
            fail('Somehow connected');
            done();
        });

        socket.on('connect_error', () => {
            socket.disconnect(true);
            done();
        });
    });
});