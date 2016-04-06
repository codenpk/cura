'use strict';
import { Component } from 'angular2/core';
import { FieldInputComponent }  from '../input/field-input.component';
import { FieldMessagesComponent }  from '../messages/field-messages.component';

/* jshint ignore:start */
@Component({
    selector: 'cura-field-control',
    directives: [FieldInputComponent, FieldMessagesComponent],
    pipes: [],
    inputs: ['control'],
    outputs: [],
    template: require('./field-control.component.html'),
    styles: [require('./field-control.component.less')],
    host: {}  
})
/* jshint ignore:end */
export class FieldControlComponent {
    constructor(){}
    
    static get parameters(){
        return [];
    }
}
