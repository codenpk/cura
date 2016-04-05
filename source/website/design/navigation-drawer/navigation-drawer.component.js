'use strict';
import { Component }    from 'angular2/core';
import { MediaQueriesDirective } from '../media-queries/media-queries.directive.js';
import { ApplicationBarComponent } from '../application-bar/application-bar.component';

/* jshint ignore:start */
@Component({
    selector: 'cura-navigation-drawer',
    directives: [ MediaQueriesDirective, ApplicationBarComponent],
    template: require('./navigation-drawer.component.html'),
    styles: [require('./navigation-drawer.component.less')]
})
/* jshint ignore:end */
export class NavigationDrawerComponent {
    constructor() {
        this.mediaQueries = { parent: true, width : [425, 768] };
    }
    
    static get parameters() {
        // return [[NavigationDrawerService]];
    }
}