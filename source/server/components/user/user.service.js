import User from './user.model';

export class UserService {
    constructor(io, passportService) {
        this.passportService = passportService;

        this.server = io.of('user');

        this.server.on('connection', socket => {
            socket.on('user_add', request => this._add(socket, request));
        });
    }

    _add(socket, request){
        User
            .count()
            .exec()
            .then((count) => {
                if (count === 0) {
                    new User(request)
                        .save()
                        .then((saved) => {
                            this.server.emit('user_added', saved);
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

    error(socket, msg) {
        socket.emit(`user_error`, msg);
    }
}
