export default {
    session: process.env.SESSIONTOKEN || 'sessionToken',
    activation: process.env.ACTIVATIONTOKEN || 'activationToken',
    server: {
        port: process.env.SERVERPORT || 3000,
        uri: process.env.SERVERURI || 'http://localhost:3000'
    },
    mongo: {
        uri: process.env.MONGOURI || 'mongodb://localhost/cura',
        options : {
            db : {
                safe: true
            }
        }
    }
};