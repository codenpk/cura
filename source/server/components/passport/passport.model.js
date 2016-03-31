'use strict';

export class PassportModel {
    constructor (authenticated, token, user){
        this.authenticated = authenticated || false;
        this.token = token;
        this.details = user;
    }

    isInRole(role){
        return this.details.roles.indexOf(role) > -1;
    }

    isMe(id){
        return this.details._id.toString() === id;
    }

    isMeOrInRole(id, role) {
        return this.isMe(id) || this.isInRole(role);
    }

    joinRooms(socket) {
        this.details.roles.forEach( role => {
           socket.join(role);
        });
    }
}