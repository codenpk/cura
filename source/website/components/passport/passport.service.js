'use strict';
import {ReplaySubject} from 'rxjs/subject/ReplaySubject';
import {ServerService} from '../server/server.service';

export class PassportService {
    constructor(serverService) {
        this.passport = new ReplaySubject(1);

        this.connection = serverService.connect('passport');

        this.connection.on('connect_error', () => {
            let stored = localStorage.getItem('passport');

            if (stored) {
                this.passport.next(stored);
            } else {
                this.passport.next({authenticated: false});
            }
        });

        this.connection.on('passport_value', passport => {
            this.passport.next(passport);
            localStorage.setItem('token', passport);

            serverService.token = passport.token;
        });
    }

    isInRole(roles) {
        return new Promise(resolve => {
            if (!Array.isArray(roles)) {
                roles = [roles];
            }

            this.currentPassport().then(passport => {
                console.log(passport);
                roles.forEach(role => {
                    if (passport.details.roles.indexOf(role) > -1) {
                        resolve(true);
                    }
                });

                resolve(false);
            });
        });
    }

    currentPassport() {
        return new Promise(resolve => {
            let temp = this.passport.subscribe(value => {
                setTimeout(() => temp.unsubscribe());
                resolve(value);
            });
        });
    }

    static get parameters() {
        return [[ServerService]];
    }
}