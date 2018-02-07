const Package = require('./package');
const Path = require('path');
const Os = require('os');

const NAME = Package.name;
const TMP_PATH = Os.tmpdir();

// const port = 8000;
// const host = '127.0.0.1';
// const address = `ws://localhost:${port}`;

// exports.host = host;
// exports.port = port;
// exports.address = address;

exports.path = Path.join(TMP_PATH, `${NAME}.sock`);
