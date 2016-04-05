'use strict';
import { BehaviorSubject } from 'rxjs/subject/BehaviorSubject';

export class ApplicationBarService {
    constructor () {
        this._name = new BehaviorSubject('cura');
    }

    set name(value) {
        this._name.next(value);
    }

    get name() {
        return this._name;
    }
}