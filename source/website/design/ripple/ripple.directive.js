'use strict';
import { Directive, ElementRef }                        from 'angular2/core';
import { DOM } from 'angular2/src/platform/dom/dom_adapter';
import { AnimationBuilder } from 'angular2/animate';

/* jshint ignore:start */
@Directive({
    selector: '[cura-ripple]',
    host: {
        '(click)' : 'ripple($event)'
    }
})
/* jshint ignore:end */
export class RippleDirective {
    constructor(elementRef, animationBuilder) {
        this.elementRef = elementRef;

        DOM.setStyle(this.elementRef.nativeElement, 'position', 'relative');
        DOM.setStyle(this.elementRef.nativeElement, '-webkit-mask-image', 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC)');

        this.rippleAnimation = animationBuilder.css()
            .setDuration(650)
            .setToStyles({ transform: `scale(2)`, opacity: '0' });
    }

    static get parameters() {
        return [[ElementRef], [AnimationBuilder]];
    }

    _getEpiCentre($event, element) {
        let epiCentre = {
            x: $event.offsetX,
            y: $event.offsetY
        };

        if (element !== $event.srcElement) {
            let rect = element.getBoundingClientRect();
            epiCentre.x = $event.clientX - rect.left;
            epiCentre.y = $event.clientY - rect.top;
        }

        return epiCentre;
    }

    _rippleContainer(element) {
        let container = element.querySelector('ripple-container');

        if (!container) {
            container = DOM.createElement('div');
            DOM.addClass(container, 'ripple-container');
            DOM.setStyle(container, 'position', 'absolute');
            DOM.setStyle(container, 'border-radius', '50%');
            DOM.setStyle(container, 'width', '100%');
            DOM.setStyle(container, 'height', '100%');
            DOM.setStyle(container, 'top', '0');
            DOM.setStyle(container, 'left', '0');
            DOM.setStyle(container, 'overflow', 'hidden');
            DOM.setStyle(container, 'pointer-events', 'none');
            DOM.appendChild(element, container);
        }

        return container;
    }

    _ripple(element, epiCentre) {
        let color = DOM.getComputedStyle(element).color || 'rgb(0,0,0)';
        let ripple = DOM.createElement('div');
        let size = Math.max(element.clientWidth, element.clientHeight);
        DOM.addClass(ripple, 'ripple');
        DOM.setStyle(ripple, 'background-color', color);
        DOM.setStyle(ripple, 'border-radius', '50%');
        DOM.setStyle(ripple, 'position', 'absolute');
        DOM.setStyle(ripple, 'left', `${epiCentre.x - size/2 }px`);
        DOM.setStyle(ripple, 'top', `${epiCentre.y - size/2 }px`);
        DOM.setStyle(ripple, 'width', `${size}px`);
        DOM.setStyle(ripple, 'height', `${size}px`);
        DOM.setStyle(ripple, 'transform', `scale(0)`);
        DOM.setStyle(ripple, 'opacity', `0.25`);

        return ripple;
    }

    ripple($event) {
        let element = this.elementRef.nativeElement;
        let epiCentre = this._getEpiCentre($event, element);
        let container = this._rippleContainer(element);
        let ripple = this._ripple(element, epiCentre);

        DOM.appendChild(container, ripple);

        let animation = this.rippleAnimation.start(ripple);

        animation.onComplete(() => {
            DOM.removeChild(container,ripple);
        });

    }
}