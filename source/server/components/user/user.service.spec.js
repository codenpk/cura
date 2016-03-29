'use strict';
import config from '../../config/config';
import app from '../app';
import User from './user.model';
import * as io          from 'socket.io-client';
let mongoose = require('mongoose');

function createAdminUser() {
    return new Promise((resolve) => {
        new User({name: 'Test', email: 'admin@user.com', password: 'test', roles: ['user', 'membership']})
            .save()
            .then(() => {
                app.routes.passportService.loginWithCredentials(null, {email: 'admin@user.com', password: 'test'})
                    .then(passport => {
                        let con = io.connect(`${config.server.uri}/user`);
                        con.emit('authenticate', passport.token);
                        resolve(con);
                    });
            });
    });
}

function createNormalUser() {
    return new Promise((resolve) => {
        new User({name: 'Test', email: 'normal@user.com', password: 'test', roles: ['user']})
            .save()
            .then(() => {
                app.routes.passportService.loginWithCredentials(null, {email: 'normal@user.com', password: 'test'})
                    .then(passport => {
                        resolve(io.connect(`${config.server.uri}/user`, {query: `token=${passport.token}`}));
                    });
            });
    });
}

function createGuestUser() {
    return io.connect(`${config.server.uri}/user`);
}

describe('User Service', () => {
    let socket;

    beforeAll((cb) => {
        app.start().then(() => cb());
    });

    afterAll((cb) => {
        app.stop().then(() => cb());
    });

    afterEach(() => {
        mongoose.connection.db.dropDatabase();
    });

    // describe('no users in database', () => {
    //     it('allows adding of a user', (done) => {
    //         socket = io.connect(`${config.server.uri}/user`);
    //         let user = {name: 'Test', email: 'test@test.com', password: 'test'};
    //
    //         socket.emit('user_add', user);
    //
    //         socket.on('user_added', () => {
    //             done();
    //         });
    //
    //         socket.on('user_error', (err) => {
    //             console.log(err);
    //             fail('Adding a user failed');
    //             done();
    //         });
    //     });
    //
    //     it('doesnt allow adding of a second user', (done) => {
    //         socket = io.connect(`${config.server.uri}/user`);
    //         let user = {name: 'Test', email: 'test@test.com', password: 'test'};
    //
    //         new User(user)
    //             .save()
    //             .then(() => {
    //                 socket.emit('user_add', user);
    //             });
    //
    //         socket.on('user_error', () => {
    //             done();
    //         });
    //     });
    // });
    //
    // describe('guest user', () => {
    //     it('can get the count of users (when there are none)', (done) => {
    //         socket = io.connect(`${config.server.uri}/user`);
    //
    //         socket.emit('user_value');
    //
    //         socket.on('user_value', (response) => {
    //             expect(response.count).toBe(0);
    //             done();
    //         });
    //     });
    //
    //     it('can get the count of users (when there are some)', (done) => {
    //         socket = io.connect(`${config.server.uri}/user`);
    //
    //         new User({name: 'Test', email: 'test@test.com', password: 'test'})
    //             .save()
    //             .then(() => {
    //                 socket.emit('user_value');
    //             });
    //
    //         socket.on('user_value', (response) => {
    //             expect(response.count).toBe(1);
    //             done();
    //         });
    //     });
    //
    //     it('cant get any information about any users', (done) => {
    //         socket = io.connect(`${config.server.uri}/user`);
    //
    //         new User({name: 'Test', email: 'test@test.com', password: 'test'})
    //             .save()
    //             .then(() => {
    //                 socket.emit('user_value');
    //             });
    //
    //         socket.on('user_value', (response) => {
    //             expect(response.users.length).toBe(0);
    //             done();
    //         });
    //     });
    //
    //     it('is informed when another guest user adds a user (but not informed of any details of that user', (done) => {
    //         socket = io.connect(`${config.server.uri}/user`);
    //         let socket2 = io.connect(`${config.server.uri}/user`);
    //
    //         socket2.emit('user_add', {name: 'Test', email: 'test@test.com', password: 'test'});
    //
    //         socket.on('user_added', (response) => {
    //             expect(response).not.toBeDefined();
    //             socket2.disconnect(true);
    //             done();
    //         });
    //     });
    //
    //     it('is informed when a authenticated user adds a user (but not informed of any of the details of that user', (done) => {
    //         createAdminUser().then(adminSocket => {
    //             let guestSocket = createGuestUser();
    //             adminSocket.emit('user_add', {email: 'anewUser@gmail.com', password: 'default'});
    //
    //             guestSocket.on('user_added', user => {
    //                 expect(user).not.toBeDefined();
    //
    //                 adminSocket.disconnect(true);
    //                 guestSocket.disconnect(true);
    //                 done();
    //             });
    //         });
    //     });
    // });

    it('can add users', (done) => {
        createAdminUser().then(adminSocket => {
            adminSocket.emit('user_add', {email: 'one@test.com', password: 'osoofif'});

            adminSocket.on('user_added', user => {
                expect(user.email).toBe('one@test.com');
                expect(user.hashedPassword).not.toBeDefined();
                expect(user.salt).not.toBeDefined();

                adminSocket.disconnect(true);
                done();
            });

            adminSocket.on('user_error', () => {
                fail();
                adminSocket.disconnect(true);
                done();
            });
        });

        // createAdminUser().then(adminSocket => {
        //     adminSocket.emit('user_add', {email: 'one@test.com', password: 'osoofif'});
        //
        //     // adminSocket.on('user_added', user => {
        //     //     expect(user.email).toBe('one@test.com');
        //     //     expect(user.hashedPassword).not.toBeDefined();
        //     //     expect(user.salt).not.toBeDefined();
        //     //
        //     //     adminSocket.disconnect(true);
        //     //     done();
        //     // });
        //
        //     adminSocket.disconnect(true);
        //     done();
        // });
    });


    // describe('normal user', () => {
    //     it('can view a list of users', (done) => {
    //         new User({name: 'Test', email: 'test@test.com', password: 'test'})
    //             .save()
    //             .then(() => {
    //                 app.routes.passportService.loginWithCredentials(null, {email: 'test@test.com', password: 'test'})
    //                     .then(passport => {
    //                         socket = io.connect(`${config.server.uri}/user`, {query: `token=${passport.token}`});
    //
    //                         socket.emit('user_value');
    //
    //                         socket.on('user_value', (response) => {
    //                             expect(response.count).toBe(1);
    //                             expect(response.users[0].email).toBe('test@test.com');
    //                             done();
    //                         });
    //                     })
    //                     .catch(err => fail(err));
    //             });
    //     });
    //
    //     it('cant view sensitive information of users', (done) => {
    //         new User({name: 'Test', email: 'test@test.com', password: 'test'})
    //             .save()
    //             .then(() => {
    //                 app.routes.passportService.loginWithCredentials(null, {email: 'test@test.com', password: 'test'})
    //                     .then(passport => {
    //                         socket = io.connect(`${config.server.uri}/user`, {query: `token=${passport.token}`});
    //
    //                         socket.emit('user_value');
    //
    //                         socket.on('user_value', (response) => {
    //                             expect(response.users[0].hashedPassword).not.toBeDefined();
    //                             expect(response.users[0].salt).not.toBeDefined();
    //                             done();
    //                         });
    //                     })
    //                     .catch(err => fail(err));
    //             });
    //     });
    //
    //     it('cant add users', (done) => {
    //         createNormalUser(normalSocket => {
    //             normalSocket.emit('user_add', {email: 'one@test.com', password: 'osoofif'});
    //
    //             normalSocket.on('user_error', () => {
    //                 done();
    //             });
    //         });
    //     });
    //
    //     it('is informed when a user is added', (done) => {
    //         createAdminUser().then(adminSocket => {
    //             createNormalUser().then(normalSocket => {
    //                 adminSocket.emit('user_add', {email: 'anewUser@gmail.com', password: 'default'});
    //
    //                 normalSocket.on('user_added', user => {
    //                     expect(user.email).toBe('anewUser@gmail.com');
    //                     expect(user.password).not.toBeDefined();
    //                     expect(user.hashedPassword).not.toBeDefined();
    //                     expect(user.salt).not.toBeDefined();
    //
    //                     adminSocket.disconnect(true);
    //                     normalSocket.disconnect(true);
    //                     done();
    //                 });
    //             });
    //         });
    //     });
    // });
});