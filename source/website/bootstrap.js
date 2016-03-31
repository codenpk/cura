'use strict';
import '../../node_modules/zone.js/dist/zone';
import 'reflect-metadata';
import { bootstrap }            from 'angular2/platform/browser';
import { ROUTER_PROVIDERS }     from 'angular2/router';
import { ApplicationComponent } from './components/application/application.component';

bootstrap(ApplicationComponent,
    [ ROUTER_PROVIDERS ]);