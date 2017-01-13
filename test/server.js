const Server = require('../index').server;

Server(function (error, socket) {
	if (error) throw error;

	socket.on('emit', function (data) {
		console.log(data);
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
