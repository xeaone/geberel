const Client = require('../index').client;

// const options = { socket: { autoClose: false } };
const client = new Client(options);

client.on('error', function (error) {
	throw error;
});

client.on('connect', function (socket) {

	socket.on('error', function (error) {
		console.log(error);
	});

	socket.relay('emit', { hello: 'foo' }, function () {
		console.log('emit: foo');
	});

	socket.relay('emit', { hello: 'bar' }, function () {
		console.log('emit: bar');
	});

	socket.request('async', { hello: 'world' }, function (data) {
		console.log(`async: ${JSON.stringify(data)}`);
	});

	socket.request('sync', { hello: 'bar' }, function (data) {
		console.log(`sync: ${JSON.stringify(data)}`);
	});

});

client.open();
