'use strict';
import {appInjector} from './can-activate.injector';
import {PassportService} from '../passport/passport.service';
import {Router} from 'angular2/router';

class CanActivateService {
    init() {
        if (!this.injector) {
            this.injector = appInjector();
            this.passportService = this.injector.get(PassportService);
            this.router = this.injector.get(Router);
        }
    }

    validRoute(roles, failRoute) {
        this.init();

        return new Promise(resolve => {
            this.passportService.isInRole(roles).then(succeeded => {
                if (succeeded || !failRoute) {
                    resolve(true);
                } else {
                    this.router.go(failRoute);
                }
            });
        });
    }
}

let instance = new CanActivateService();

export default instance;