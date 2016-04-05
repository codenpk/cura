'use strict';
let appInjectorRef;
export const appInjector = function (injector) {
    if (injector) {
        appInjectorRef = injector;
    }

    return appInjectorRef;
};