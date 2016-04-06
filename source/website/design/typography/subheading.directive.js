'use strict';
import { Directive, ElementRef } from 'angular2/core';
import { DOM } from 'angular2/src/platform/dom/dom_adapter';

/* jshint ignore:start */
@Directive({
    selector: '[cura-subheading]'
})
/* jshint ignore:end */
export class SubHeadingDirective {
    constructor(elementRef){
        DOM.setStyle(elementRef.nativeElement, 'font-size', '1rem');
        DOM.setStyle(elementRef.nativeElement, 'font-weight', '400');
        DOM.setStyle(elementRef.nativeElement, 'line-height', '1.5rem');
        DOM.setStyle(elementRef.nativeElement, 'margin', '0');
    }

    static get parameters(){
        return [[ElementRef]];
    }
}