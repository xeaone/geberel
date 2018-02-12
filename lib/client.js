'use strict';

const Net = require('net');
const Socket = require('./socket');
const Global = require('../global');

module.exports = function (options, callback) {

	if (!options) {
		options = { path: Global.path };
	} else if (typeof options === 'function') {
		callback = options;
		options = { path: Global.path };
	}

	const client = Net.createConnection(options);

	client.on('error', callback);

	client.on('connect', function () {
		callback(null, new Socket(client, options.socket));
	});

	process.on('SIGINT', function () {
		client.end();
		process.exit(0);
	});

	return client;
};
