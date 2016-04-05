'use strict';
import {Component, EventEmitter}                          from 'angular2/core';
import {ServerService}                      from '../server/server.service';
import { FlatButtonComponent }              from '../../design';
import { NoSignalSVG } from './no-signal.svg.js';

/* jshint ignore:start */
@Component({
    selector: 'offline',
    outputs: ['open'],
    directives: [ FlatButtonComponent, NoSignalSVG ],
    template: `
    <div class="content">
        <h1 id="offlineTitle">Offline Device</h1>
        <div class="icon">
            <no-signal-svg></no-signal-svg>
        </div>
        <p id="offlineDescription">Your device appears to be offline, or the server is down, you may continue to use the website, but some functionality may be lost.</p>
    </div>
    <menu>
        <button cura-flat-button theme="dark" (click)="close()">Continue</button>
    </menu>
    `,
    styles: [require('./offline.component.less')]
})
/* jshint ignore:end */
export class OfflineComponent {
    constructor(serverService) {
        this.serverService = serverService;
        this.open = new EventEmitter();
    }

    ngOnInit(){


        this.serverService.status.subscribe(status => {
            this.open.emit(status === 'offline');
        });
    }

    close() {
        this.open.emit(false);
    }

    static get parameters() {
        return [[ServerService]];
    }
}