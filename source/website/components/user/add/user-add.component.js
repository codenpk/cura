'use strict';
import {    Component }
    from 'angular2/core';
import {    FormBuilder }
    from 'angular2/common';
import {    ApplicationBarService,
            CardComponent,
            RaisedButtonComponent }
    from '../../../design';
import {    NameEditComponent,
            EmailEditComponent,
            PasswordEditComponent }
    from '../components';
import {    UserService }
    from '../user.service';

/* jshint ignore:start */
@Component({
    selector: 'user-add',
    directives: [NameEditComponent, 
        EmailEditComponent,
        PasswordEditComponent,
        CardComponent, 
        RaisedButtonComponent],
    template: require('./user-add.component.html'),
    styles: [require('./user-add.component.less')]
})
/* jshint ignore:end */
export class UserAddComponent {
    constructor(applicationBarService, formBuilder, userService) {
        this.userService = userService;
        applicationBarService.name = 'add first user';

        this.form = formBuilder.group();
    }

    controlAdd(event) {
        this.form.addControl(event.name, event.control);
        this.form.updateValueAndValidity();
    }

    submit(event) {
        event.preventDefault();

        let user = {
            email: this.form.controls.email.value,
            name: this.form.controls.name.value
        };

        this.userService.add(user);
    }

    static get parameters() {
        return [[ApplicationBarService],[FormBuilder],[UserService]];
    }
}