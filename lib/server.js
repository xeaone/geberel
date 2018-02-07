const Fs = require('fs');
const Net = require('net');
const Util = require('util');
const Path = require('path');

const Socket = require('./socket');
const Global = require('../global');

const Stat = Util.promisify(Fs.stat);
const Unlink = Util.promisify(Fs.unlink);

const destroy = function (server, connections) {

	for (let name in connections) {
		connections[name].write('__disconnect');

		connections[name].on('end', function() {
			delete connections[name];
		});

		connections[name].end();
	}

	server.close();

	process.exit(0);
}

const create = function (options, connections) {
	return new Promise(function(resolve, reject) {

		const server = Net.createServer(options);

		server.on('error', reject);

		server.on('connection', function (socket) {
			connections[Date.now()] = socket;

			resolve(new Socket({
				socket: socket,
				autoClose: options.autoClose
			}));
		});

		server.listen(options.path);

	});
};

module.exports = async function (options) {
	const connections = {};

	options = options || { path: Global.path };

	let error;

	try {
		await Stat(options.path);
	} catch (e) {
		error = e;
	}

	if (!error) {
		await Unlink(options.path);
	}

	const server = await create(options, connections);

	process.on('SIGINT', destroy.bind(null, server, connections));

	return server;
};
