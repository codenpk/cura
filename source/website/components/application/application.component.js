'use strict';
import { Component }                        from 'angular2/core';
import { BehaviorSubject }                  from 'rxjs/subject/BehaviorSubject';
import { RouteConfig, ROUTER_DIRECTIVES, Router }                      from 'angular2/router';

import { UserService }                      from '../user/user.service';
import { OfflineComponent }                 from '../offline/offline.component';
import { ActivityComponent }                from '../activity/activity.component';
import { DialogComponent,
        NavigationDrawerComponent }           from '../../design';

import { HomeComponent }                    from '../home/home.component';
import { UserComponent }                    from '../user/user.component';

/* jshint ignore:start */
@Component({
    selector: 'body',
    directives: [OfflineComponent, ActivityComponent, DialogComponent, ROUTER_DIRECTIVES, NavigationDrawerComponent ],
    template: `
        <dialog [open]="active">
            <activity [open]="active"></activity>
        </dialog>
        <dialog [open]="offline">
            <offline (open)="offlineChange($event)"></offline>
        </dialog>
        <cura-navigation-drawer>
            <router-outlet></router-outlet>
        </cura-navigation-drawer>
`,
    styles: [require('./application.component.less')]
})
@RouteConfig([
    { path: '/',                name: 'Home',       component: HomeComponent },
    { path: '/user/...',        name: 'User',       component: UserComponent }
])
/* jshint ignore:end */
export class ApplicationComponent {
    constructor(userService, router) {
        this.active = new BehaviorSubject(true);
        this.offline = new BehaviorSubject(false);

        userService.users.subscribe( data => {
            this.active.next(false);

            if (data.count === 0) {
                router.navigate(['User','Add']);
            }
        });
    }

    offlineChange(event) {
        this.offline.next(event);
    }

    static get parameters() {
        return [[UserService],[Router]];
    }
}