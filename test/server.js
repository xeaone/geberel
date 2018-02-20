const Server = require('../index').server;

const server = new Server();

server.on('error', function (error) {
	throw error;
});

server.on('connect', function (socket) {

	socket.on('error', function (error) {
		console.log(error);
	});

	socket.when('emit', function (data) {
		console.log(`emit: ${JSON.stringify(data)}`);
	});

	socket.respond('async', function (data, done) {
		setTimeout(function () {
			data.more = 'async';
			done(data);
		}, 1000);
	});

	socket.respond('sync', function (data, done) {
		data.more = 'sync';
		done(data);
	});

});

server.open();
