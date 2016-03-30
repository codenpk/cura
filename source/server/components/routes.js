'use strict';
import { PassportService } from './passport/passport.service';
import { UserService } from './user/user.service';

export class Routes {
    constructor(server) {
        this.passportService = new PassportService(server);
        new UserService(server, this.passportService);
    }
}