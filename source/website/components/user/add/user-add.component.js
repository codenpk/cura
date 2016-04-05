'use strict';
import { Component }                        from 'angular2/core';
import { ApplicationBarService }   from '../../../design';

import { NameEditComponent } from '../components';

/* jshint ignore:start */
@Component({
    selector: 'user-add',
    directives: [NameEditComponent],
    template: require('./user-add.component.html'),
    styles: [require('./user-add.component.less')]
})
/* jshint ignore:end */
export class UserAddComponent {
    constructor(applicationBarService) {
        applicationBarService.name = 'add user';
    }

    static get parameters() {
        return [[ApplicationBarService]];
    }
}