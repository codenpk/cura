'use strict';

describe('Server starting up', () => {
    it('has no unexpected errors', () => {
        expect( () => require('../../dist/server/server')).not.toThrow();
    });
});