const Globals = require('./globals');
const Ws = require('ws');

const ACTIVE = Globals.codes.server.active;
const INACTIVE = Globals.codes.server.inactive;

const ERRORED = Globals.codes.server.errored;
const ECONNREFUSED = Globals.codes.server.econnrefused;

const STATE_DEFAULTS = Globals.stateDefaults;

module.exports = function (options, callback) {
	const result = {};

	if (typeof options === 'function') { callback = options; options = STATE_DEFAULTS; }

	const WsSocket = new Ws(options.address, options);

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
