'use strict';

const Client = require('../index').client;

const options = { address: 'ws://localhost:8000'};

Client(options, function (error, socket) {
	if (error) throw error;

	socket.transmit('test', { test: 'stuff' }, function (data) {
		console.log(data);
	});

	socket.receive('another', function (data, cb) {
		data.colors = 'cool';
		return cb(data);
	});
});
