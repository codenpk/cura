'use strict';
import { Component } from 'angular2/core';

/* jshint ignore:start */
@Component({
    selector: 'cura-field-messages',
    directives: [],
    pipes: [],
    inputs: ['control'],
    outputs: [],
    template: require('./field-messages.component.html'),
    styles: [require('./field-messages.component.less')],
    host: {
        '[class]' : 'control.classesString()'
    }
})
/* jshint ignore:end */
export class FieldMessagesComponent {
    constructor(){}

    ngOnInit(){
        this.messageKeys = Object.keys(this.control.messages);
    }

    static get parameters(){
        return [];
    }
}
