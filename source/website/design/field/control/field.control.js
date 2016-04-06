'use strict';
import { Control } from 'angular2/common';

export class FieldControl extends Control {
    constructor(options, validator, asyncValidator){
        super(options.value, validator, asyncValidator);
        this.id = Math.random().toString(36).substr(2, 9);
        this.messages = options.messages;
        this.type = options.type || 'text';
        this.label = options.label;
        this.disabled = options.disabled || false;
    }

    get empty () {
        return !this.value;
    }

    classesString() {
        let classes = [
            `${this.dirty ? `dirty` : `pristine`}`,
            `${this.valid ? `valid` : `invalid`}`,
            `${this.touched ? `touched` : `untouched`}`,
            `${this.focus ? 'focus' : 'nofocus' }`,
            `${this.empty ? 'empty' : 'defined' }`
        ];

        return classes.join(' ');
    }

    classesForErrorString(errorKey) {
        let valid;
        if (!this.validator) {
            valid = 'notvalidated';
        }
        if (this.errors && typeof(this.errors[errorKey]) !== 'undefined') {
            valid = this.errors[errorKey]
        }

        let classes = [
            `${this.dirty ? `dirty` : `pristine`}`,
            `${typeof(valid) === 'undefined' ? `valid` : valid === 'notvalidated' ? 'notvalidated' : 'invalid' }`,
            `${this.touched ? `touched` : `untouched`}`,
            `${this.focus ? 'focus' : 'nofocus' }`
        ];

        return classes.join(' ');
    }
}
