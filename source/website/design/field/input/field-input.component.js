'use strict';
import { Component } from 'angular2/core';

/* jshint ignore:start */
@Component({
    selector: 'cura-field-input',
    directives: [],
    pipes: [],
    inputs: ['control'],
    outputs: [],
    template: require('./field-input.component.html'),
    styles: [require('./field-input.component.less')],
    host: {
        '(focusin)' : 'focus = true',
        '(focusout)': 'focus = false',
        '[class]'   : 'control.classesString()'
    }
})
/* jshint ignore:end */
export class FieldInputComponent {
    constructor(){}

    get focus() {
        return this.control.focus;
    }

    set  focus(value) {
        this.control.focus = value;
    }

    static get parameters(){
        return [];
    }
}
