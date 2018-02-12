'use strict';

const Package = require('./package');
const Path = require('path');
const Os = require('os');

const NAME = Package.name;
const TMP_PATH = Os.tmpdir();

exports.path = Path.join(TMP_PATH, `${NAME}.sock`);
