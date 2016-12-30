const port = 8000;
const address =  'ws://localhost:8000';

const serverDefaults = { port: port };
const clientDefaults = { address: address };
const stateDefaults = { address: address };

const codes = {
	server: {
		active: 'ACTIVE',
		inactive: 'INACTIVE',

		errored: 'ERRORED',

		econnrefused: 'ECONNREFUSED'
	}
};

exports.serverDefaults = serverDefaults;
exports.clientDefaults = clientDefaults;
exports.stateDefaults = stateDefaults;

exports.codes = codes;
