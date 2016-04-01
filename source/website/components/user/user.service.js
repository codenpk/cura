'use strict';
import {PassportService} from '../passport/passport.service';
import {ReplaySubject} from 'rxjs/subject/ReplaySubject';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import {ServerService} from '../server/server.service';

export class UserService {
    constructor(serverService, passportService) {
        this.users = new ReplaySubject(1);

        passportService.passport.subscribe(() => {
            if (this.connection) {
                this.connection.disconnect();
            }

            this.connection = serverService.connect('user');

            this.connection.emit('user_value');

            this.connection.on('user_value', response => {
               let users = response.users.map( user => {
                  return new BehaviorSubject(user);
               });

                this.users.next({ users: users, count: response.count });
            });

            this.connection.on('user_update', data => {
                this.find(data.email).then( user => {
                    user.next(data.user);
                });
            });
        });
    }

    find(email) {
        return new Promise (resolve => {
            let tempObserve = this.users.subscribe( (observable) => {
                let user = observable.users.filter(userObservable => {
                    return userObservable.value.email === email;
                })[0];

                setTimeout( () => tempObserve.unsubscribe());
                resolve(user);
            });
        });
    }
}