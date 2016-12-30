const Globals = require('./globals');
const Socket = require('./socket');
const Ws = require('ws');

const SERVER_DEFAULTS = Globals.serverDefaults;

module.exports = function (options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = SERVER_DEFAULTS;
	}

	const WsServer = new Ws.Server(options);

	WsServer.on('error', function (error) {
		return callback(error);
	});

	WsServer.on('connection', function (WsSocket) {
		const socket = new Socket (WsSocket, options.autoClose);
		return callback(null, socket);
	});
};
