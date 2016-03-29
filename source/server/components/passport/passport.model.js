export class PassportModel {
    constructor (authenticated, token, user){
        this.authenticated = authenticated || false;
        this.token = token;
        this.details = user;
    }

    isInRole(role){
        return this.details.roles.indexOf(role) > -1;
    }

    joinRooms(socket) {
        this.details.roles.forEach( role => {
           socket.join(role);
        });
    }
}