const Global = require('../global');
const Ws = require('ws');

const ACTIVE = 'ACTIVE';
const ERRORED = 'ERRORED';
const INACTIVE = 'INACTIVE';
const ECONNREFUSED = 'ECONNREFUSED';

module.exports = function (options, callback) {

	if (typeof options === 'function' || !options) {
		callback = options;
		options = { address: Global.address };
	}

	const WsSocket = new Ws(options.address, options);
	const result = {};

	WsSocket.on('error', function (error) {

		if (error.code === ECONNREFUSED) {
			result.connected = false;
			result.status = INACTIVE;
		} else {
			result.connected = false;
			result.status = ERRORED;
			result.error = error;
		}

		return callback(result);
	});

	WsSocket.on('open', function () {
		result.connected = true;
		result.status = ACTIVE;
		WsSocket.terminate();
		return callback(result);
	});
};
