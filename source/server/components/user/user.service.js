import User from './user.model';
import pick from 'lodash/pick';

export class UserService {
    constructor(io, passportService) {
        this.passportService = passportService;

        this.server = io.of('/user');

        this.server.on('connection', socket => {
            let token = socket.handshake.query.token;
            console.log('User Service Token!!' + '\n');
            console.log(token + '\n');
            //
            // this.passportService.loginWithToken(null, socket.handshake.query.token).then (passport => {
            //
            //     socket.passport = passport;
            //     // socket.passport.joinRooms(socket);
            //
            //     socket.on('user_add', request => this._add(socket, request));
            //
            //     socket.on('user_value', request => this._value(socket, request));
            // });
        });
    }

    _add(socket, request){
        User
            .count()
            .exec()
            .then((count) => {
                if (count === 0 || socket.passport.isInRole('membership')) {

                    if (count === 0) request.roles = ['user','membership','admin'];

                    new User(request)
                        .save()
                        .then((saved) => {
                            this.server.to('user').emit('user_added', pick(saved, ['email', 'name', 'roles']));
                            this.server.to('guest').emit('user_added');
                        })
                        .catch( err => this.error(socket, err));
                } else {
                    this.error(socket, 'Not allowed to add user');
                }
            })
            .catch(err => this.error(socket, err));
    }

    _change(){

    }

    _delete(){

    }

    _value(socket, request) {
        User.find()
            .select('-salt -hashedPassword')
            .exec()
            .then( users => {
                if (socket.passport.isInRole('user')) {
                    socket.emit('user_value', { count: users.length, users: users});
                } else {
                    socket.emit('user_value', { count: users.length, users: []});
                }
            });
    }

    error(socket, msg) {
        socket.emit(`user_error`, msg);
    }
}
