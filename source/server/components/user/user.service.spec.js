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

    describe('adding user validation', () => {
        it('requires an email address', (done) => {
            createAdminUser().then(socket => {
                socket.emit('user_add', {name: 'John', password: 'skfkf'});

                socket.on('user_added', () => {
                    fail();
                    done();
                });

                socket.on('user_error', () => {
                    done();
                });
            });
        });

        it('requires a name', (done) => {
            createAdminUser().then(socket => {
                socket.emit('user_add', {email: 'John@test.com', password: 'skfkf'});

                socket.on('user_added', () => {
                    fail();
                    done();
                });

                socket.on('user_error', () => {
                    done();
                });
            });
        });

        it('has a unique email address', (done) => {
            createAdminUser().then(socket => {
                socket.emit('user_add', {email: 'admin@user.com', name: 'whocares', password: 'skfkf'});

                socket.on('user_added', () => {
                    fail();
                    done();
                });

                socket.on('user_error', () => {
                    done();
                });
            });
        });
    });

    describe('changing a users details', () => {
        describe('guest user', () => {
            it('spurious attempt fails', (done) => {
                let socket = connect();

                socket.emit('user_change', {});

                socket.on('user_error', () => {
                    done();
                });
            });

            it('cant alter anyones details', (done) => {
                createNormalUser('john').then(normalUser => {
                    let socket = connect();

                    normalUser.emit('user_value');

                    normalUser.on('user_value', data => {
                        let user = data.users[0];
                        user.name = 'bob';

                        socket.emit('user_change', user);
                    });

                    socket.on('user_error', () => {
                        done();
                    });
                });
            });

            it('not notified of a change in a users details', (done) => {
                createNormalUser('john').then(normalUser => {
                    let socket = connect();
                    let normalChanged = false;
                    let unauthChanged = false;

                    normalUser.emit('user_value');

                    normalUser.on('user_value', data => {
                        let user = data.users[0];
                        user.name = 'bob';

                        normalUser.emit('user_change', user);
                    });

                    normalUser.on('user_changed', () => {
                        normalChanged = true;
                    });

                    socket.on('user_changed', () => {
                        unauthChanged = true;
                    });

                    setTimeout(() => {
                        expect(normalChanged).toBe(true);
                        expect(unauthChanged).toBe(false);
                        done();
                    }, 1000);
                });
            });
        });

        describe('normal user', () => {
            it('can alter own name', (done) => {
                createNormalUser('john').then(socket => {
                    socket.emit('user_value');

                    socket.on('user_value', data => {
                        let user = data.users[0];
                        user.name = 'bob';

                        socket.emit('user_change', user);

                        socket.on('user_changed', update => {
                            expect(update.email).toEqual(user.email);
                            expect(update.name).toEqual(user.name);
                            done();
                        });
                    });

                    socket.on('user_error', err => {
                        fail(err);
                        done();
                    });
                });
            });

            it('can alter own email', (done) => {
                createNormalUser('john').then(socket => {
                    socket.emit('user_value');

                    socket.on('user_value', data => {
                        let user = data.users[0];
                        user.email = 'bob@tyyy.com';

                        socket.emit('user_change', user);

                        socket.on('user_changed', update => {
                            expect(update.email).toEqual(user.email);
                            expect(update.name).toEqual(user.name);
                            done();
                        });
                    });

                    socket.on('user_error', err => {
                        fail(err);
                        done();
                    });
                });
            });

            it('can alter own password', (done) => {
                createNormalUser('john').then(socket => {
                    socket.emit('user_value');

                    socket.on('user_value', data => {
                        let user = data.users[0];
                        user.password = 'passwordNew';

                        socket.emit('user_change', user);

                        socket.on('user_changed', () => {
                            app.routes.passportService.loginWithCredentials(null,
                                {email: 'john@user.com', password: 'passwordNew'})
                                .then(passport => {
                                    expect(passport.authenticated).toBe(true);
                                    expect(passport.details.email).toBe('john@user.com');
                                    done();
                                })
                                .catch(err => {
                                    fail(err);
                                    done();
                                });
                        });
                    });

                    socket.on('user_error', err => {
                        fail(err);
                        done();
                    });
                });
            });

            it('cant alter anothers name', (done) => {
                createNormalUser('john').then(john => {
                    createNormalUser('bob').then(bob => {
                        bob.emit('user_value');

                        bob.on('user_value', data => {
                            let findJohn = data.users.filter(user => user.name === 'john')[0];

                            findJohn.name = 'margret';

                            bob.emit('user_change', findJohn);
                        });

                        bob.on('user_changed', () => {
                            fail('allowed user to alter anothers data');
                            done();
                        });

                        bob.on('user_error', () => {
                            done();
                        });
                    });
                });
            });

            it('doesnt incorrectly alter unchanged data', (done) => {
                createNormalUser('john').then(socket => {
                    socket.emit('user_value');

                    socket.on('user_value', data => {
                        let user = data.users[0];
                        user.name = 'william';

                        socket.emit('user_change', user);

                        socket.on('user_changed', () => {
                            app.routes.passportService.loginWithCredentials(null,
                                {email: 'john@user.com', password: 'test'})
                                .then(passport => {
                                    expect(passport.authenticated).toBe(true);
                                    expect(passport.details.email).toBe('john@user.com');
                                    done();
                                })
                                .catch(err => {
                                    fail(err);
                                    done();
                                });
                        });
                    });

                    socket.on('user_error', err => {
                        fail(err);
                        done();
                    });
                });
            });

            it('is notified when another user makes a change', (done) => {
                createNormalUser('john').then(john => {
                    createNormalUser('bob').then(bob => {
                        bob.emit('user_value');

                        bob.on('user_value', data => {
                            let wendy = data.users.filter(user => user.name === 'bob')[0];

                            wendy.name = 'wendy';

                            bob.emit('user_change', wendy);
                        });

                        john.on('user_changed', user => {
                            expect(user.name).toBe('wendy');
                            done();
                        });
                    });
                });
            });
        });

        describe('admin user', () => {
            it('can alter anothers personal details', (done) => {
                createAdminUser().then(admin => {
                    createNormalUser('bob').then(bob => {
                        admin.emit('user_value');

                        admin.on('user_value', data => {
                            let margret = data.users.filter(user => user.name === 'bob')[0];

                            margret.name = 'margret';

                            admin.emit('user_change', margret);
                        });

                        admin.on('user_changed', (user) => {
                            expect(user.name).toBe('margret');
                            done();
                        });

                        admin.on('user_error', err => {
                            fail(err);
                            done();
                        });
                    });
                });
            });

            it('cant alter anothers password', (done) => {
                createAdminUser().then(admin => {
                    createNormalUser('bob').then(bob => {
                        admin.emit('user_value');

                        admin.on('user_value', data => {
                            let bob = data.users.filter(user => user.name === 'bob')[0];

                            bob.password = 'newPassword';

                            admin.emit('user_change', bob);
                        });

                        admin.on('user_changed', () => {
                            fail('shouldnt of changed details');
                            done();
                        });

                        admin.on('user_error', () => {
                            done();
                        });
                    });
                });
            });
        });
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

                adminSocket.emit('user_add', {name: 'bob', email: 'anewUser@gmail.com', password: 'default'});

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
                    adminSocket.emit('user_add', {name: 'john', email: 'anewUser@gmail.com', password: 'default'});

                    normalSocket.on('user_added', user => {
                        expect(user.email).toBe('anewuser@gmail.com');
                        expect(user.password).not.toBeDefined();
                        expect(user.hashedPassword).not.toBeDefined();
                        expect(user.salt).not.toBeDefined();
                        done();
                    });
                });
            });
        });
    });

    describe('admin user', () => {
        it('can add a user', (done) => {
            createAdminUser().then(socket => {
                socket.emit('user_add', {name: 'john', email: 'test@newuser.com', password: 'skfkf'});

                socket.on('user_added', user => {
                    expect(user.email).toBe('test@newuser.com');
                    done();
                });
            });
        });
    });
});