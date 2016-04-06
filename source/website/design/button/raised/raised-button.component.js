'use strict';
import { Component } from 'angular2/core';
import { RippleDirective } from '../../ripple/ripple.directive';

/* jshint ignore:start */
@Component({
    selector: '[cura-raised-button]',
    directives: [RippleDirective],
    pipes: [],
    inputs: [],
    outputs: [],
    template: require('./raised-button.component.html'),
    styles: [require('./raised-button.component.less')],
    host: {}
})
/* jshint ignore:end */
export class RaisedButtonComponent {
    constructor(){}

    static get parameters(){
        return [];
    }
}