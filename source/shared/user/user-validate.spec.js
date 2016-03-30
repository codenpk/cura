'use strict';
import { UserValidate } from './user-validate';

describe('Email Validators', () => {
    it('is unique', () => {
        expect(UserValidate.isUnique('a@b.com',['a@c.com','fff'])).toBe(true);
    });

    it('isnt unique', () => {
        expect(UserValidate.isUnique('a@b.com',['a@b.com','fff'])).toBe(false);
    });

    it('isnt unique case difference', () => {
        expect(UserValidate.isUnique('a@b.com',['a@B.com','fff'])).toBe(false);
    });
});