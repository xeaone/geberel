const Client = require('../index').client;

Client(function (error, socket) {
	if (error) throw error;

	socket.emit('emit', { hello: 'foo' }, function () {
		console.log('emit: foo');
	});

	socket.emit('emit', { hello: 'bar' }, function () {
		console.log('emit: bar');
	});

	socket.request('async', { hello: 'world' }, function (data) {
		console.log(data);
	});

	socket.request('sync', { hello: 'bar' }, function (data) {
		console.log(data);
	});

});
