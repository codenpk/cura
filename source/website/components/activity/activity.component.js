'use strict';
import { Component }                        from 'angular2/core';

/* jshint ignore:start */
@Component({
    selector: 'activity',
    template: require('./activity.component.html'),
    styles: [require('./activity.component.less')],
    inputs: ['open']
})
/* jshint ignore:end */
export class ActivityComponent {
    constructor() {
        this.open = true;
    }

    

    static get parameters() {
        // return [[]];
    }
}