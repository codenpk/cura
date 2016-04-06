'use strict';
import { Component } from 'angular2/core';

/* jshint ignore:start */
@Component({
    selector: 'cura-card',
    directives: [],
    pipes: [],
    inputs: [],
    outputs: [],
    template: require('./card.component.html'),
    styles: [require('./card.component.less')],
    host: {}
})
/* jshint ignore:end */
export class CardComponent {
    constructor(){}

    static get parameters(){
        return [];
    }
}