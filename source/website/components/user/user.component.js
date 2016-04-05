'use strict';
import { Component }                        from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES }   from 'angular2/router';

import { UserAddComponent }                 from './add/user-add.component';

/* jshint ignore:start */
@Component({
    selector: 'user',
    directives: [ROUTER_DIRECTIVES],
    template: `<router-outlet></router-outlet>`
})
@RouteConfig([
    { path: '/add',     name: 'Add',        component: UserAddComponent }
])
/* jshint ignore:end */
export class UserComponent {
    constructor() {
    }

    static get parameters() {
        // return [[]];
    }
}