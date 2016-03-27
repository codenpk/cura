import { PassportService } from './passport/passport.service';

export class Routes {
    constructor(server) {
        let passportService = new PassportService(server);
    }
}