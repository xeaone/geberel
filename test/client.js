'use strict';

const Client = require('../index').client;

const options = { address: 'ws://localhost:7777', autoClose: false };

Client(options, function (error, socket) {
	if (error) throw error;

	socket.transmit('test', { test: 'stuff' }, function (data) {
		console.log(data);
	});

	socket.receive('another', function (data) {
		console.log(data);
	});
});
