'use strict';
import { Directive, ElementRef } from 'angular2/core';
import { DOM } from 'angular2/src/platform/dom/dom_adapter';

/* jshint ignore:start */
@Directive({
    selector: '[cura-caption]'
})
/* jshint ignore:end */
export class CaptionDirective {
    constructor(elementRef){
        this.elementRef = elementRef;

        DOM.setStyle(elementRef.nativeElement, 'font-size', '0.875rem');
        DOM.setStyle(elementRef.nativeElement, 'font-weight', '400');
        DOM.setStyle(elementRef.nativeElement, 'line-height', '1rem');
        DOM.setStyle(elementRef.nativeElement, 'margin', '0');
    }

    ngOnInit(){
        DOM.setStyle(this.elementRef.nativeElement, 'color', 'rgba(0,0,0,0.5)');
    }

    static get parameters(){
        return [[ElementRef]];
    }
}