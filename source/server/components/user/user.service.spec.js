'use strict';
import app from '../app';
import User from './user.model';
import * as io          from 'socket.io-client';
let mongoose = require('mongoose');

describe('User Service', () => {
    let socket;

    beforeAll((cb) => {
        app.start().then( () => cb());
    });

    afterAll((cb) => {
        app.stop().then( () => cb());
    });

    beforeEach(() => {
        mongoose.connection.db.dropDatabase();
    });

    afterEach( () => {
        socket.disconnect(true);
    });

    it('allows unauthenticated adding of a user when none exist', (done) => {
        socket = io.connect('http://localhost:3000/user');
        let user = { name: 'Test', email: 'test@test.com', password: 'test'};

        socket.emit('user_add', user);

        socket.on('user_added', () => {
            done();
        });

        socket.on('user_error', (err) => {
            console.log(err);
            fail('Adding a user failed');
            done();
        });
    });

    it('doesnt allow unauthenticated adding of a user when another already exists', (done) => {
        socket = io.connect('http://localhost:3000/user');
        let user = { name: 'Test', email: 'test@test.com', password: 'test'};

        new User(user)
            .save()
            .then(() => {
                socket.emit('user_add', user);
            });

        socket.on('user_error', () => {
            done();
        });
    });
});