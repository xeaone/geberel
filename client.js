'use strict';

const Socket = require('./socket');
const Ws = require('ws');

const ADDRESS = 'ws://localhost:8000';
const DEFAULTS = { address: ADDRESS };


module.exports = function (options, callback) {
	if (typeof options === 'function') { callback = options; options = DEFAULTS; }

	const WsSocket = new Ws(options.address, options);

	WsSocket.on('error', function (error) {
		return callback(error, null);
	});

	WsSocket.on('open', function () {
		const socket = Socket (WsSocket);
		return callback(null, socket);
	});
};
