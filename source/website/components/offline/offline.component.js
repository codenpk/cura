'use strict';
import {Component}                          from 'angular2/core';
import {ServerService}                      from '../server/server.service';
import { FlatButtonComponent }              from '../../design';
import { NoSignalSVG } from './no-signal.svg.js';

/* jshint ignore:start */
@Component({
    selector: 'offline',
    directives: [ FlatButtonComponent, NoSignalSVG ],
    template: `
    <div class="content">
        <h1 id="offlineTitle">Offline Device</h1>
        <div class="icon">
            <no-signal-svg *ngIf="opening || opened"></no-signal-svg>
        </div>
        <p id="offlineDescription">Your device appears to be offline, or the server is down, you may continue to use the website, but some functionality may be lost.</p>
    </div>
    <menu>
        <button cura-flat-button theme="dark" (click)="close()">Continue</button>
    </menu>
    `,
    host: {
        '[class.opened]': 'opened',
        '[class.opening]': 'opening',
        '[class.closed]': 'closed',
        '[class.closing]': 'closing',
        '(transitionend)' : 'transitionEnd()'
    },
    styles: [require('./offline.component.less')]
})
/* jshint ignore:end */
export class OfflineComponent {
    constructor(serverService) {
        serverService.status.subscribe(status => {
            this.opening = status === 'offline';
        });
    }

    ngAfterViewChecked(){
        this.initialised = true;
    }

    transitionEnd() {
        if (this.closing === true) {
            this.opened = false;
            this.closed = true;
        }
        if (this.opening === true) {
            this.opened = true;
            this.closed = false;
        }

        this.opening = false;
        this.closing = false;
    }

    close() {
        this.closing = true;
    }

    static get parameters() {
        return [[ServerService]];
    }
}