'use strict';

const Fs = require('fs');
const Net = require('net');
const Path = require('path');
const Socket = require('./socket');
const Global = require('../global');

module.exports = function (options, callback) {
	let server, connections = [];

	if (!options) {
		options = { path: Global.path };
	} else if (typeof options === 'function') {
		callback = options;
		options = { path: Global.path };
	}

	const server = Net.createServer(options);

	server.on('error', callback);

	server.on('connection', function (socket) {
		connections.push(socket);
		callback(null, new Socket(socket, options.socket));
	});

	server.listen(options.path);

	process.on('SIGINT', function () {
		let connection;

		while (connection = connections.shift()) {
			connection.end();
		}

		server.close();
		process.exit(0);
	});

	return server;
};

// Fs.stat(options.path, function (error) {
// 	if (error) {
// 	server = create(options, connections, callback);
// 	} else {
// 		Fs.unlink(options.path, function (error) {
// 			if (error) {
// 				callback(error);
// 			} else {
// 				server = create(options, connections, callback);
// 			}
// 		});
// 	}
// });
