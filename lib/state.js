const Globals = require('./globals');
const Ws = require('ws');

const ACTIVE = Globals.codes.active;
const ERRORED = Globals.codes.errored;
const INACTIVE = Globals.codes.inactive;
const ECONNREFUSED = Globals.codes.econnrefused;
const STATE_DEFAULTS = Globals.stateDefaults;

module.exports = function (options, callback) {
	options = options || STATE_DEFAULTS;

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
