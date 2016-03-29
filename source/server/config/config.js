let config = require('./dev.config');

if (process.env.NODE_ENV === 'test') {
    config = require('./test.config');
}

export default config.default;