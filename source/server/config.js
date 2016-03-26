export const config = {
    session: process.env.SESSIONTOKEN || 'sessionToken',
    activation: process.env.ACTIVATIONTOKEN || 'activationToken',
    mongo: {
        uri: process.env.MONGOURI || 'mongodb://localhost/cura',
        options : {
            db : {
                safe: true
            }
        }
    }
};