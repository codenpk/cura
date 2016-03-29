let jwt = require('jsonwebtoken');
import User from '../user/user.model';
import config from '../../config/config';
import {PassportModel} from './passport.model';

function random() {
    return Math.random().toString(36).substr(2, 9);
}

function guestPassport(token) {
    return new PassportModel(
        false,
        token || jwt.sign({guest: true, _id: random()}, config.session),
        {
            roles: ['guest']
        }
    );
}

function userPassport(user) {
    return new PassportModel(
        true,
        jwt.sign({_id: user._id}, config.session),
        user
    )
}

export class PassportService {
    constructor(io) {
        this.server = io.of('passport');

        this.server.on('connection', socket => {
            socket.on('authenticate', request => this.loginWithToken(socket, request));

            socket.on('passport_login', request => this.loginWithCredentials(socket, request));
        });
    }

    loginWithCredentials(socket, credentials) {
        return new Promise( (resolve, reject) => {
            User
                .findOne({email: credentials.email})
                .exec()
                .then(user => {
                    if (user.authenticate(credentials.password)) {
                        if (socket) socket.emit('passport_change', userPassport(user));
                        else resolve(userPassport(user));
                    } else {
                        if (socket) socket.emit('passport_error', 'invalid credentials');
                        else reject();
                    }
                })
                .catch(() => {
                    if (socket) socket.emit('passport_error', 'invalid credentials');
                    else reject();
                });
        });
    }

    loginWithToken(socket, token) {
        let promise = new Promise(resolve => {
            jwt.verify(token, config.session, (err, decoded) => {
                if (err || decoded.guest === true) {
                    resolve(guestPassport(token));
                } else {
                    User
                        .findOne({_id: decoded._id})
                        .exec()
                        .then(user => {
                            resolve(userPassport(user))
                        })
                        .catch(() => resolve(guestPassport()))
                }
            });
        });

        if (socket) {
            promise.then(passport => {
                socket.emit('passport_value', passport);
            });
        } else {
            return promise;
        }
    }
}