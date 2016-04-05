'use strict';
import { Component }                          from 'angular2/core';

/* jshint ignore:start */
@Component({
    selector: 'dialog',
    host: {
        '[class.opened]': 'opened',
        '[class.opening]': 'opening',
        '[class.closed]': 'closed',
        '[class.closing]': 'closing',
        '(transitionend)' : 'transitionEnd()'
    },
    template: `<ng-content></ng-content>`,
    inputs: ['open'],
    styles: [require('./dialog.component.less')]
})
/* jshint ignore:end */
export class DialogComponent {
    constructor() {
    }

    ngOnInit(){
        this.open.subscribe(value => {
            if (value) {
                this.closing = false;
                this.opening = true;
            } else {
                this.opening = false;
                this.closing = true;
            }
        });
    }

    transitionEnd() {
        if (this.closing === true) {
            this.opened = false;
            this.closed = true;
        }
        if (this.opening === true) {
            this.opened = true;
            this.closed = false;
        }

        this.opening = false;
        this.closing = false;
    }
}