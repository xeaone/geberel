'use strict';

const Server = require('../index').server;

const options = { port: 8000 };

Server(options, function (error, socket) {
	if (error) throw error;

	socket.receive('test', function (data, cb) {
		data.more = 'works';
		return cb(data);
	});

	socket.transmit('another', { blue: 'red' }, function (data) {
		console.log(data);
	});
});
