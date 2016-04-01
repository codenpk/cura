'use strict';
import { ReplaySubject } from 'rxjs/subject/ReplaySubject';
import { ServerService } from '../server/server.service';

export class PassportService {
    constructor(serverService) {
        this.passport = new ReplaySubject(1);
        
        this.connection = serverService.connect('passport');

        this.connection.on('connect_error', () => {
            let stored = localStorage.getItem('passport');

            if (stored) {
                this.passport.next(stored);
            } else {
                this.passport.next({ authenticated: false });
            }
        });

        this.connection.on('passport_value', passport => {
            this.passport.next(passport);
            localStorage.setItem('token', passport);

            serverService.token = passport.token;
        });
    }
    
    static get parameters() {
        return [[ServerService]];
    }
}