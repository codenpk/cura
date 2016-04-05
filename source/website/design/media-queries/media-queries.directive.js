'use strict';
import { Directive, EventEmitter, ElementRef } from 'angular2/core';
import { DOM } from 'angular2/src/platform/dom/dom_adapter';
import { ResizedElement } from './resized-element';

function calculateBreakpoints(size, rules) {
    let query = [];

    for (let breakpoint of rules) {
        if (size >= breakpoint) {
            query.push(`${breakpoint}px`);
        }
    }

    return query;
}

/* jshint ignore:start */
@Directive({
    selector: `[mediaQueries]`,
    inputs: ['mediaQueries'],
    outputs: ['sizeChanged'],
    host: {
        '[attr.min-width]': 'minWidth()'
    }
})
/* jshint ignore:end */
export class MediaQueriesDirective {
    constructor(element) {
        this._element = element;
        this.sizeChanged = new EventEmitter();
        this.minWidths = '';
    }

    ngOnInit() {
        let element = this._element.nativeElement;

        if (this.mediaQueries.parent){
            element = element.parentNode;
        }

        this.listener = new ResizedElement(DOM, element);
    }

    ngAfterViewInit(){
        this.listener.subscribe((size) => {
            this.sizeChanged.emit(size);

            if (this.mediaQueries.width) {
                let widths = calculateBreakpoints(size.width, this.mediaQueries.width);

                this.minWidths = widths.join(' ');
            }
        });
    }

    ngOnDestroy() {
        this.listener.unsubscribe();
    }

    minWidth() {
        return this.minWidths;
    }

    static get parameters() {
        return [[ElementRef]];
    }
}