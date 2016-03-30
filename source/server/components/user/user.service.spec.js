'use strict';
import config from '../../config/config';
import app from '../app';
import User from './user.model';
import * as io          from 'socket.io-client';
let mongoose = require('mongoose');

describe('User Service', () => {
    let sockets = [];

    function addUser(user) {
        return new User(user).save();
    }

    function connect(token) {
        let socket = io.connect(`${config.server.uri}/user`);

        socket.emit('authenticate', token);

        sockets.push(socket);

        return socket;
    }

    function createAdminUser() {
        return new Promise((resolve) => {
            addUser({name: 'Test', email: 'admin@user.com', password: 'test', roles: ['user', 'membership']})
                .then(() => {
                    app.routes.passportService.loginWithCredentials(null, {email: 'admin@user.com', password: 'test'})
                        .then(passport => {
                            resolve(connect(passport.token));
                        });
                });
        });
    }

    function createNormalUser(name) {
        return new Promise((resolve) => {
            addUser({name: name, email: `${name}@user.com`, password: 'test', roles: ['user']})
                .then(() => {
                    app.routes.passportService.loginWithCredentials(null, {email: `${name}@user.com`, password: 'test'})
                        .then(passport => {
                            resolve(connect(passport.token));
                        });
                });
        });
    }

    beforeAll((cb) => {
        app.start().then(() => cb());
    });

    afterAll((cb) => {
        app.stop().then(() => cb());
    });

    afterEach(() => {
        sockets.forEach(socket => {
            socket.disconnect();
        });
        sockets = [];
        mongoose.connection.db.dropDatabase();
    });

    describe('guest user', () => {
        it(`can create the a user if there's no previously created`, (done) => {
            let socket = connect();

            socket.emit('user_add', {name: 'Test', email: 'test@test.com', password: 'test'});

            socket.on('user_added', () => done());
        });

        it(`can't create a user if one already exists`, (done) => {
            let socket = connect();

            addUser({name: 'Test', email: 'test@test.com', password: 'test'})
                .then(() => {
                    socket.emit('user_add', {name: 'Test2', email: 'test2@test.com', password: 'test'});
                });

            socket.on('user_error', () => done());
        });

        it('can get the count of users (when there are none)', (done) => {
            let socket = connect();

            socket.emit('user_value');

            socket.on('user_value', (response) => {
                expect(response.count).toBe(0);
                done();
            });
        });

        it('can get the count of users (when there are some)', (done) => {
            let socket = connect();

            addUser({name: 'Test', email: 'test@test.com', password: 'test'})
                .then(() => {
                    socket.emit('user_value');
                });

            socket.on('user_value', (response) => {
                expect(response.count).toBe(1);
                done();
            });
        });

        it('cant get any information about any users', (done) => {
            let socket = connect();

            addUser({name: 'Test', email: 'test@test.com', password: 'test'})
                .then(() => {
                    socket.emit('user_value');
                });

            socket.on('user_value', (response) => {
                expect(response.users.length).toBe(0);
                done();
            });
        });

        it('is informed when another guest user adds a user (but not informed of any details of that user', (done) => {
            let socket = connect();
            let socket2 = connect();

            socket2.emit('user_add', {name: 'Test', email: 'test@test.com', password: 'test'});

            socket.on('user_added', (response) => {
                expect(response).not.toBeDefined();
                done();
            });
        });

        it('is informed when a authenticated user adds a user (but not informed of any of the details of that user', (done) => {
            createAdminUser().then(adminSocket => {
                let guestSocket = connect();

                adminSocket.emit('user_add', {email: 'anewUser@gmail.com', password: 'default'});

                guestSocket.on('user_added', user => {
                    expect(user).not.toBeDefined();
                    done();
                });
            });
        });
    });

    describe('normal user', () => {
        it('can view a list of users', (done) => {
            createNormalUser('bob')
                .then(socket => {
                    socket.emit('user_value');

                    socket.on('user_value', response => {
                        expect(response.count).toBe(1);
                        expect(response.users[0].email).toBe(`bob@user.com`);
                        done();
                    });
                });
        });

        it('cant view sensitive information of users', (done) => {
            createNormalUser('bob')
                .then(socket => {
                    socket.emit('user_value');

                    socket.on('user_value', response => {
                        expect(response.users[0].hashedPassword).not.toBeDefined();
                        expect(response.users[0].salt).not.toBeDefined();
                        done();
                    });
                });
        });

        it('cant add users', (done) => {
            createNormalUser('bob')
                .then(socket => {
                    socket.emit('user_add', {email: 'one@test.com', password: 'osoofif'});

                    socket.on('user_error', () => {
                        done();
                    });
                });
        });

        it('is informed when a user is added', (done) => {
            createAdminUser().then(adminSocket => {
                createNormalUser('bob').then(normalSocket => {
                    adminSocket.emit('user_add', {email: 'anewUser@gmail.com', password: 'default'});

                    normalSocket.on('user_added', user => {
                        expect(user.email).toBe('anewUser@gmail.com');
                        expect(user.password).not.toBeDefined();
                        expect(user.hashedPassword).not.toBeDefined();
                        expect(user.salt).not.toBeDefined();
                        done();
                    });
                });
            });
        });
    });
});