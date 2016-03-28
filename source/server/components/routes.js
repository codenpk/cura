import { PassportService } from './passport/passport.service';
import { UserService } from './user/user.service';

export class Routes {
    constructor(server) {
        let passportService = new PassportService(server);
        let userService = new UserService(server, passportService);
    }
}