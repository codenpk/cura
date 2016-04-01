'use strict';
import { Component }                        from 'angular2/core';
import { RippleDirective } from '../../ripple/ripple.directive';

/* jshint ignore:start */
@Component({
    directives: [ RippleDirective ],
    selector: '[cura-flat-button]',
    template: `<div class="flat-button" cura-ripple><ng-content></ng-content></div>`,
    styles: [require('./flat-button.component.less')]
})
/* jshint ignore:end */
export class FlatButtonComponent {
    constructor() {
    }

    // static get parameters() {
    //     return [[]];
    // }
}