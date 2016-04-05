'use strict';
import { ReplaySubject } from 'rxjs/subject/ReplaySubject';

function createContainer(DOM) {
    let container = DOM.createElement('div');
    DOM.setStyle(container, 'position', 'absolute');
    DOM.setStyle(container, 'left', '0');
    DOM.setStyle(container, 'bottom', '0');
    DOM.setStyle(container, 'top', '0');
    DOM.setStyle(container, 'right', '0');
    DOM.setStyle(container, 'z-index', '-1');
    DOM.setStyle(container, 'visibility', 'hidden');
    DOM.setStyle(container, 'overflow', 'hidden');

    return container;
}

function createChild(DOM) {
    let child = DOM.createElement('div');
    DOM.setStyle(child, 'position', 'absolute');
    DOM.setStyle(child, 'left', '0');
    DOM.setStyle(child, 'bottom', '0');
    DOM.setStyle(child, 'transition', '0s');

    return child;

}

function reset(expandChild, expand, shrink) {
    expandChild.style.width = 100000 + 'px';
    expandChild.style.height = 100000 + 'px';

    expand.scrollLeft = 100000;
    expand.scrollTop = 100000;

    shrink.scrollLeft = 100000;
    shrink.scrollTop = 100000;
}

export class ResizedElement {
    constructor(DOM, element) {
        this.DOM = DOM;
        this.element = element;
        this.size = new ReplaySubject();
        this.previous = {};

        this.container = createContainer(this.DOM);
        this.shrink = createContainer(this.DOM);
        this.expand = createContainer(this.DOM);
        this.expandChild = createChild(this.DOM);
        this.shrinkChild = createChild(this.DOM);
        this.DOM.setStyle(this.shrinkChild, 'width', '200%');
        this.DOM.setStyle(this.shrinkChild, 'height', '200%');

        this.DOM.appendChild(this.expand, this.expandChild);
        this.DOM.appendChild(this.shrink, this.shrinkChild);

        this.DOM.appendChild(this.container, this.expand);
        this.DOM.appendChild(this.container, this.shrink);

        this.DOM.appendChild(this.element, this.container);
    }

    _scrolled() {
        let width = this.element.offsetWidth;
        let height = this.element.offsetHeight;

        if (this.previous.width !== width || this.previous.height !== height) {
            this.previous.width = width;
            this.previous.height = height;

            this.size.next({
                width: width,
                height: height
            });
        }

        reset(this.expandChild, this.expand, this.shrink);
    }

    subscribe(fn) {
        reset(this.expandChild, this.expand, this.shrink);

        this.expand.addEventListener('scroll', () => this._scrolled());
        this.shrink.addEventListener('scroll', () => this._scrolled());

        this.subscriber = this.size.subscribe( (value) => fn(value));
    }

    unsubscribe(){
        this.subscriber.unsubscribe();

        this.expand.removeEventListener('scroll');
        this.shrink.removeEventListener('scroll');
    }
}