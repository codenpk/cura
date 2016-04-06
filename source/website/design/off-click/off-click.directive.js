'use strict';
import { Directive } from 'angular2/core';

@Directive({
    selector: `[offClick]`,
    inputs: ['offClick'],
    host: {
        '(click)' : 'onClick($event)'
    }
})
export class OffClickDirective {
    ngAfterViewInit() {
        setTimeout(() =>{
            document.addEventListener('click', this.offClick);
        });
    }

    ngOnDestroy() {
        document.removeEventListener('click', this.offClick);
    }

    onClick($event) {
        $event.stopPropagation();
    }
}