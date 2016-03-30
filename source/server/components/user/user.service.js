'use strict';
import User from './user.model';
import pick from 'lodash/pick';
import { UserValidate} from '../../../shared/user/user-validate';

export class UserService {
    constructor(io, passportService) {
        this.passportService = passportService;

        this.server = io.of('user');

        this.server.on('connection', socket => {
            socket.authenticated = new Promise( (resolve) => {
                socket.once('authenticate', token => {
                    this.passportService.loginWithToken(null, token).then (passport => {
                        passport.joinRooms(socket);
                        resolve(passport);
                    });
                });
            });

            socket.on('user_add', request => {
                this._add(socket, request);
            });

            socket.on('user_value', request => {
                this._value(socket, request);
            });
        });
    }

    _add(socket, request){
        socket.authenticated.then(passport => {
            User
                .find()
                .exec()
                .then((users) => {
                    if (users.length === 0 || passport.isInRole('membership')) {
                        if (users.length === 0) {
                            request.roles = ['user','membership','admin'];
                        }
                        
                        if (!UserValidate.isUnique(request.email, users.map(item => item.email ))){
                            UserService.error(socket, 'User is not unique');
                        }

                        new User(request)
                            .save()
                            .then((saved) => {
                                this.server.to('user').emit('user_added', pick(saved, ['email', 'name', 'roles']));
                                this.server.to('guest').emit('user_added');
                            })
                            .catch( err => UserService.error(socket, err));
                    } else {
                        UserService.error(socket, 'Not allowed to add user');
                    }
                })
                .catch(err => UserService.error(socket, err));
        });
    }

    _change(){

    }

    _delete(){

    }

    _value(socket) {
        socket.authenticated.then(passport => {
            User.find()
                .select('-salt -hashedPassword')
                .exec()
                .then( users => {
                    if (passport.isInRole('user')) {
                        socket.emit('user_value', { count: users.length, users: users});
                    } else {
                        socket.emit('user_value', { count: users.length, users: []});
                    }
                });
        });
    }

    static error(socket, msg) {
        socket.emit(`user_error`, msg);
    }
}
