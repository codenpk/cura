'use strict';
import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import { ApplicationBarService } from './application-bar.service';

/* jshint ignore:start */
@Component({
    selector: 'cura-application-bar',
    directives: [ROUTER_DIRECTIVES],
    template: require('./application-bar.component.html'),
    styles: [require('./application-bar.component.less')]
})
/* jshint ignore:end */
export class ApplicationBarComponent {
    constructor(application) {
        application.name.subscribe( (value) => {
            this.name = value;
        });
    }

    static get parameters(){
        return [[ApplicationBarService]];
    }
}