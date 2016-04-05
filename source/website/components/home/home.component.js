'use strict';
import { Component }                        from 'angular2/core';
import { CanActivate }                           from 'angular2/router';
import { LogoComponent }                    from '../logo/logo.component';
import CanActivateService from '../can-activate/can-activate.decorator';

/* jshint ignore:start */
@Component({
    selector: 'home',
    directives: [ LogoComponent ],
    template: require('./home.component.html'),
    styles: [require('./home.component.less')]
})
@CanActivate(() => {
    return CanActivateService.validRoute(['guest','user'], true);
})
/* jshint ignore:end */
export class HomeComponent {
    constructor() {
    }

    static get parameters() {
        // return [[]];
    }
}
