'use strict';
import { Component, EventEmitter } from 'angular2/core';
import { Validators }   from          'angular2/common';
import { FieldControl, FieldControlComponent } from '../../../../design';

/* jshint ignore:start */
@Component({
    selector: '[password-edit]',
    directives: [FieldControlComponent],
    pipes: [],
    inputs: [],
    outputs: ['control'],
    template: require('./password-edit.component.html'),
    styles: [require('./password-edit.component.less')],
    host: {}  
})
/* jshint ignore:end */
export class PasswordEditComponent {
    constructor(){
        this.control = new EventEmitter();

        this.field = new FieldControl({
            value: '',
            messages: {
                required: {
                    message: 'Password to login to the site (required)'
                }
            },
            label: 'password',
            type: 'password'
        }, Validators.compose([Validators.required]));
    }

    ngOnInit(){
        this.control.emit({ name: 'password', control: this.field});
    }
    
    static get parameters(){
        return [];
    }
}