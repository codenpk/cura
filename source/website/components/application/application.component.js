'use strict';
import { Component }                        from 'angular2/core';
import { PassportService }                  from '../passport/passport.service';
import { OfflineComponent }                 from '../offline/offline.component';
import { ActivityComponent }                from '../activity/activity.component';

/* jshint ignore:start */
@Component({
    selector: 'body',
    directives: [OfflineComponent, ActivityComponent],
    template: `
        <activity></activity>
        <offline></offline>`,
    styles: [require('./application.component.less')]
})
/* jshint ignore:end */
export class ApplicationComponent {
    constructor(passportService) {
        this.message = 'Application Loading';

        passportService.passport.subscribe( passport => {
            if (!passport.authenticated) {
                this.message = "Hello Guest!";
            }
        });
    }

    static get parameters() {
        return [[PassportService]];
    }
}