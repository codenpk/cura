import { PassportService } from './passport/passport.service';
import { UserService } from './user/user.service';

export class Routes {
    constructor(server) {
        this.passportService = new PassportService(server);
        this.userService = new UserService(server, this.passportService);
    }
}