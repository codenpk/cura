'use strict';
import app from './app';

describe('app', () => {
    it('allows a correct connection', (done) => {
        let socket = require('socket.io-client')('http://localhost:3000');

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
        let socket = require('socket.io-client')('http://localhost:3001');

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