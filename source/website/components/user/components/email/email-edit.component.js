'use strict';
import { Component, EventEmitter } from 'angular2/core';
import { Validators }   from          'angular2/common';
import { FieldControl, FieldControlComponent } from '../../../../design';
import { UserService } from '../../user.service';

/* jshint ignore:start */
@Component({
    selector: '[email-edit]',
    directives: [FieldControlComponent],
    pipes: [],
    inputs: [],
    outputs: ['control'],
    template: require('./email-edit.component.html'),
    styles: [require('./email-edit.component.less')],
    host: {}  
})
/* jshint ignore:end */
export class EmailEditComponent {
    constructor(userService){
        this.control = new EventEmitter();

        this.field = new FieldControl({
                value: '',
                messages: {
                    emailFormatValid: {message: 'Your email for contact (required)'}
                },
                label: 'Email',
                type: 'email'
            },
            Validators.compose([Validators.required])
        );

    }

    ngOnInit(){
        this.control.emit({ name: 'email', control: this.field});
    }
    
    static get parameters(){
        return [[UserService]];
    }
}