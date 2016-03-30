let config = {
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

if (process.env.NODE_ENV === 'test') {
    config.server.port = process.env.SERVERPORT || 3001;
    config.server.uri = process.env.SERVERURI || 'http://localhost:3001';

    config.mongo.uri = process.env.MONGOURI || 'mongodb://localhost/cura-test';
}

export default config;