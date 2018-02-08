'use strict';

const Fs = require('fs');
const Net = require('net');
const Path = require('path');
const Socket = require('./socket');
const Global = require('../global');

// TODO fixe multiple sockets

const destroy = function (server, connections) {

	connections.forEach(function (connection, index) {
		connection.on('end', function() {
			connections.splice(index, 1);
		});
		connection.end();
	});

	server.close();

	process.exit(0);
};

const create = function (options, connections, callback) {
	const server = Net.createServer(options);

	server.on('error', function (error) {
		callback(error);
	});

	server.on('connection', function (socket) {
		connections.push(socket);
		callback(null, new Socket({
			socket: socket,
			autoClose: options.autoClose
		}));
	});

	server.listen(options.path);

	return server;
};

module.exports = function (options, callback) {
	let server, connections = [];

	if (!options) {
		options = { path: Global.path };
	} else if (typeof options === 'function') {
		callback = options;
		options = { path: Global.path };
	}

	Fs.stat(options.path, function (error) {
		if (error) {
			server = create(options, connections, callback);
		} else {
			Fs.unlink(options.path, function (error) {
				if (error) {
					callback(error);
				} else {
					server = create(options, connections, callback);
				}
			});
		}
	});

	process.on('SIGINT', destroy.bind(null, server, connections));
};
