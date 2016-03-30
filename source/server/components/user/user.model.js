'use strict';
let mongoose = require('mongoose');
let crypto = require('crypto');

let UserSchema = new mongoose.Schema({
    email: {type : String, lowercase: true, required: true },
    name: {type: String, lowercase: true, required: true },
    hashedPassword: String,
    sessionSecret: String,
    salt: String,
    roles: { type: [String], default: ['user'] }
});

UserSchema.path('email').validate();

UserSchema
    .virtual('password')
    .set(function (password) {
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    });

UserSchema.methods = {
    authenticate : function (password) {
        return this.encryptPassword(password) === this.hashedPassword;
    },
    makeSalt: function () {
        return crypto.randomBytes(16).toString('base64');
    },
    encryptPassword: function(password) {
        if (!password || !this.salt) {
            return '';
        }
        let salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};

export default mongoose.model('User', UserSchema);