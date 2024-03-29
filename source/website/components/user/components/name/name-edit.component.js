'use strict';
import { Component, EventEmitter } from 'angular2/core';
import { Validators }   from          'angular2/common';
import { FieldControl, FieldControlComponent } from '../../../../design';

/* jshint ignore:start */
@Component({
    selector: '[name-edit]',
    outputs: ['control'],
    directives: [FieldControlComponent],
    template: require('./name-edit.component.html'),
    styles: [require('./name-edit.component.less')]
})
/* jshint ignore:end */
export class NameEditComponent {
    constructor() {
        this.control = new EventEmitter();

        this.field = new FieldControl({
           value: '',
            messages: {
                required: {
                    message: 'Your display name (required)'
                }
            },
            label: 'name',
            type: 'text'
        }, Validators.compose([Validators.required]));
    }
    
    ngOnInit(){
        this.control.emit({ name: 'name', control: this.field});
    }
}
