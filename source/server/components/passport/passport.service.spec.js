'use strict';
import config from '../../config/config';
import app from '../app';
import User from '../user/user.model';
import * as io          from 'socket.io-client';
let mongoose = require('mongoose');

function addUser(user) {
    return new User(user).save();
}

describe('Passport Service', () => {
    let socket;

    beforeAll((cb) => {
        app.start().then( () => cb());
    });

    afterAll((cb) => {
        app.stop().then( () => cb());
    });

    afterEach( () => {
        socket.disconnect(true);
        mongoose.connection.db.dropDatabase();
    });

    it('gives a guest passport on connection with no token', (done) => {
        socket = io.connect(`${config.server.uri}/passport`);

        socket.emit('authenticate');

        socket.on('passport_value', passport => {
            expect(passport.authenticated).toBe(false);
            expect(passport.details.roles).toEqual(['guest']);
            done();
        });
    });

    it('gives a guest passport on connection with a invalid token', (done) => {
        socket = io.connect(`${config.server.uri}/passport`);

        socket.emit('authenticate', 'sddddsddaass');

        socket.on('passport_value', passport => {
            expect(passport.authenticated).toBe(false);
            expect(passport.details.roles).toEqual(['guest']);
            done();
        });
    });

    it('returns the same guest passport on connection with a valid guest passport', (done) => {
        socket = io.connect(`${config.server.uri}/passport`);

        socket.emit('authenticate', 'sddddsddaass');

        socket.once('passport_value', passport => {
            socket.emit('authenticate',passport.token);

            socket.once('passport_value', newPassport => {
                expect(newPassport.authenticated).toBe(false);
                expect(passport.token).toEqual(newPassport.token);
                done();
            });
        });
    });

    it('returns a valid passport for a user with the correct credentials', (done) => {
        let userPromise = addUser({ name: 'Test', email: 'test@test.com', password: 'test'});

        socket = io.connect(`${config.server.uri}/passport`);

        socket.emit('authenticate');

        socket.once('passport_value', () => {
            userPromise.then( () => {
                socket.emit('passport_login', { email: 'test@test.com', password: 'test'});
            });
        });

        socket.on('passport_change', passport => {
            expect(passport.authenticated).toBe(true);
            expect(passport.details.roles).toEqual(['user']);
            expect(passport.details.email).toEqual('test@test.com');
            done();
        });
    });

    it('errors when using logging in with malformed request', (done) => {
        let userPromise = addUser({ name: 'Test', email: 'test@test.com', password: 'test'});

        socket = io.connect(`${config.server.uri}/passport`);

        socket.emit('authenticate');

        socket.once('passport_value', () => {
            userPromise.then( () => {
                socket.emit('passport_login', { });
            });
        });

        socket.on('passport_error', message => {
            expect(message).toEqual('invalid credentials');
            done();
        });
    });

    it('errors when using logging in with an invalid email address', (done) => {
        let userPromise = addUser({ name: 'Test', email: 'test@test.com', password: 'test'});

        socket = io.connect(`${config.server.uri}/passport`);

        socket.emit('authenticate');

        socket.once('passport_value', () => {
            userPromise.then( () => {
                socket.emit('passport_login', { email: 'john.smith@gmail.com' });
            });
        });

        socket.on('passport_error', message => {
            expect(message).toEqual('invalid credentials');
            done();
        });
    });

    it('errors when using logging in with a valid email address but invalid password', (done) => {
        let userPromise = addUser({ name: 'Test', email: 'test@test.com', password: 'test'});

        socket = io.connect(`${config.server.uri}/passport`);

        socket.emit('authenticate');

        socket.once('passport_value', () => {
            userPromise.then( () => {
                socket.emit('passport_login', { email: 'john.smith@gmail.com', password: 'jimmycricket' });
            });
        });

        socket.on('passport_error', message => {
            expect(message).toEqual('invalid credentials');
            done();
        });
    });

    it('gives the correct passport when logging in with a valid token', (done) => {
        let userPromise = addUser({ name: 'Test', email: 'test@test.com', password: 'test'});

        socket = io.connect(`${config.server.uri}/passport`);

        socket.emit('authenticate');

        // get guest passport then login
        socket.once('passport_value', () => {
            userPromise.then( () => {
                socket.emit('passport_login', { email: 'test@test.com', password: 'test'});
            });
        });

        // get passport from login, disconnect and login with token
        socket.on('passport_change', passport => {
            socket.disconnect(true);

            let socket2 = io.connect(`${config.server.uri}/passport`);

            socket2.emit('authenticate',passport.token);

            socket2.on('passport_value', passport2 => {
                socket2.disconnect(true);
                expect(passport).toEqual(passport2);
                done();
            });
        });
    });

    it('gives a guest passport when logging in with a tampered token', (done) => {
        let userPromise = addUser({ name: 'Test', email: 'test@test.com', password: 'test'});

        socket = io.connect(`${config.server.uri}/passport`);

        socket.emit('authenticate');

        // get guest passport then login
        socket.once('passport_value', () => {
            userPromise.then( () => {
                socket.emit('passport_login', { email: 'test@test.com', password: 'test'});
            });
        });

        // get passport from login, disconnect and login with token
        socket.on('passport_change', passport => {
            socket.disconnect(true);

            let socket2 = io.connect(`${config.server.uri}/passport`);

            socket2.emit('authenticate',passport.token.toUpperCase());

            socket2.on('passport_value', passport2 => {
                socket2.disconnect(true);
                expect(passport).not.toEqual(passport2);
                expect(passport2.authenticated).toBe(false);
                done();
            });
        });
    });
});