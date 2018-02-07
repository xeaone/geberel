const Net = require('net');

const Socket = require('./socket');
const Global = require('../global');

const SOCKET_PATH = Global.socketPath;

module.exports = function (options) {
	return new Promise(function(resolve, reject) {

		options = options || { path: Global.path };

		const client = Net.createConnection(options);

		client.on('error', reject);

		client.on('connect', function () {
			resolve(new Socket({
				socket: client,
				autoClose: options.autoClose
			}));
		});

	});
};
