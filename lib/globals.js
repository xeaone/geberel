const port = 8000;
const host = 'ws://localhost';
const address = `${host}:${port}`;

const serverDefaults = { port: port };
const stateDefaults = { address: address };
const clientDefaults = { address: address };

const codes = {
	active: 'ACTIVE',
	errored: 'ERRORED',
	inactive: 'INACTIVE',
	econnrefused: 'ECONNREFUSED'
};

exports.codes = codes;
exports.stateDefaults = stateDefaults;
exports.serverDefaults = serverDefaults;
exports.clientDefaults = clientDefaults;
