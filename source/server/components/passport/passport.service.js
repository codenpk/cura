export class PassportService {
    constructor (io) {
        this.server = io.of('passport');

        this.server.on('connection', socket => {
            socket.emit('connected');
        });
    }
}