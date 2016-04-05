'use strict';
import { Component }                        from 'angular2/core';

/* jshint ignore:start */
@Component({
    selector: 'cura-logo',
    template: require('./logo.component.html'),
    styles: [require('./logo.component.less')],
    inputs: ['text']
})
/* jshint ignore:end */
export class LogoComponent {}
