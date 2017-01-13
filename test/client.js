const Client = require('../index').client;

Client(function (error, socket) {
	if (error) throw error;

	socket.emit('emit', { hello: 'world' }, function () {
		console.log('emit');
	});

	socket.request('async', { hello: 'world' }, function (data) {
		console.log(data);
	});

	socket.request('sync', { hello: 'world' }, function (data) {
		console.log(data);
	});

});
