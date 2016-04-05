'use strict';
import '../../node_modules/zone.js/dist/zone';
import 'reflect-metadata';
import { bootstrap }            from 'angular2/platform/browser';
import { ROUTER_PROVIDERS }     from 'angular2/router';
import { ApplicationComponent } from './components/application/application.component';
import { appInjector }          from './components/can-activate/can-activate.injector';

import { ServerService } from './components/server/server.service';
import { PassportService } from './components/passport/passport.service';
import { UserService }  from './components/user/user.service';

import { ApplicationBarService } from './design';

bootstrap(ApplicationComponent,
    [ ROUTER_PROVIDERS, ServerService, PassportService, UserService, ApplicationBarService ])
    .then( cr => appInjector(cr.injector));