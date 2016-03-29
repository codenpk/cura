export default {
    session: process.env.SESSIONTOKEN || 'sessionToken',
    activation: process.env.ACTIVATIONTOKEN || 'activationToken',
    server: {
        port: process.env.SERVERPORT || 3001,
        uri: process.env.SERVERURI || 'http://localhost:3001'
    },
    mongo: {
        uri: process.env.MONGOURI || 'mongodb://localhost/cura-test',
        options : {
            db : {
                safe: true,
                drop: true
            }
        }
    }
};