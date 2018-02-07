const Global = require('../global');
const Socket = require('./socket');
const Ws = require('ws');

module.exports = function (options, callback) {

	if (typeof options === 'function' || !options) {
		callback = options;
		options = { address: Global.address };
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
