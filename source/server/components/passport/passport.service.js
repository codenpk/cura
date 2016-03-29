let jwt = require('jsonwebtoken');
import User from '../user/user.model';
import config from '../../config/config';

function guestPassport(token) {
    return {
        authenticated: false,
        token: token || jwt.sign({ guest: true, _id: random()}, config.session),
        details: {
            roles: ['guest']
        }
    }
}

function random(){
    return Math.random().toString(36).substr(2, 9);
}

function userPassport(user) {
    return {
        authenticated: true,
        token: jwt.sign({ _id: user._id }, config.session),
        details: user
    }
}

export class PassportService {
    constructor (io) {
        this.server = io.of('passport');

        this.server.on('connection', socket => {
            let token = socket.handshake.query.token;

            this._loginWithToken(socket, token);

            socket.on('passport_login', request => this._loginWithCredentials(socket, request));
        });
    }

    _loginWithCredentials(socket, credentials) {
        User
            .findOne({ email: credentials.email })
            .exec()
            .then( user => {
                if (user.authenticate(credentials.password)) {
                    socket.emit('passport_change', userPassport(user));
                } else {
                    socket.emit('passport_error', 'invalid credentials' );
                }
            })
            .catch( () => socket.emit('passport_error', 'invalid credentials' ));
    }

    _loginWithToken(socket, token) {
        new Promise(resolve => {
            jwt.verify(token, config.session, (err, decoded) => {
                if(err || decoded.guest === true) {
                    resolve(guestPassport(token));
                } else {
                    User
                        .findOne({ _id: decoded._id })
                        .exec()
                        .then( user => {
                            resolve(userPassport(user))
                        })
                        .catch( () => resolve(guestPassport()))
                }
            });
        }).then ( passport => {
            socket.emit('passport_value', passport);
        });
    }
}