const Client = require('../index').client;

const client = new Client();

client.on('error', function (error) {
	throw error;
});

client.on('connect', function (socket) {

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

client.open();
