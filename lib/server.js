const Globals = require('./globals');
const Socket = require('./socket');
const Ws = require('ws');

module.exports = function (options, callback) {

	if (typeof options === 'function' || !options) {
		callback = options;
		options = { port: Globals.port, host: Globals.host };
	}

	const WsServer = new Ws.Server(options);

	WsServer.on('error', function (error) {
		return callback(error);
	});

	WsServer.on('connection', function (WsSocket) {
		return callback(
			null,
			new Socket (WsSocket, options.autoClose)
		);
	});

};
