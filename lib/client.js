const Globals = require('./globals');
const Socket = require('./socket');
const Ws = require('ws');

const CLIENT_DEFAULTS = Globals.clientDefaults;

module.exports = function (options, callback) {

	if (typeof options === 'function' || !options) {
		callback = options;
		options = CLIENT_DEFAULTS;
	}

	const WsSocket = new Ws(options.address, options);

	WsSocket.on('error', function (error) {
		return callback(error);
	});

	WsSocket.on('open', function () {
		return callback(
			null,
			new Socket (WsSocket, options.autoClose)
		);
	});
};
