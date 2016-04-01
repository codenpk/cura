'use strict';

let config = {
    server: {
        port: process.env.SERVERPORT || 3000,
        uri: process.env.SERVERURI || 'http://localhost:3000'
    }
};

if (process.env.NODE_ENV === 'test') {
    config.server.port = process.env.SERVERPORT || 3001;
    config.server.uri = process.env.SERVERURI || 'http://localhost:3001';
}

export default config;