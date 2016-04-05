'use strict';
import { Component }                        from 'angular2/core';
import { LogoComponent }                    from '../logo/logo.component';

/* jshint ignore:start */
@Component({
    selector: 'activity',
    inputs: ['open'],
    directives: [ LogoComponent ],
    template: require('./activity.component.html'),
    styles: [require('./activity.component.less')]
})
/* jshint ignore:end */
export class ActivityComponent {
    constructor() {
    }
    
    static get parameters() {
        // return [[]];
    }
}