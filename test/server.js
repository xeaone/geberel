'use strict';

const Server = require('../index').server;

const options = { port: 7777 };

Server(options, function (error, socket) {
	if (error) throw error;

	socket.receive('test', function (data, callback) {
		console.log(data);
		data.more = 'works';
		return callback(data);
	});

	socket.transmit('another', 'cool thing');
});
