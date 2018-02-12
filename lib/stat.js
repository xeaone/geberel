'use strict';

const Net = require('net');
const Global = require('../global');

const ACTIVE = 'ACTIVE';
const ERRORED = 'ERRORED';
const INACTIVE = 'INACTIVE';

const ENOENT = 'ENOENT';
const ECONNREFUSED = 'ECONNREFUSED';

module.exports = function (options, callback) {

	if (!options) {
		options = { path: Global.path };
	} else if (typeof options === 'function') {
		callback = options;
		options = { path: Global.path };
	}

	const result = {};
	const socket = Net.createConnection(options);

	stat.on('error', function (error) {

		if (error.code === ENOENT || error.code === ECONNREFUSED) {
			result.connected = false;
			result.status = INACTIVE;
		} else {
			result.connected = false;
			result.status = ERRORED;
			result.error = error;
		}

		callback(result);
	});

	stat.on('connect', function () {

		result.connected = true;
		result.status = ACTIVE;
		socket.end();

		callback(result);
	});

	return stat;
};
