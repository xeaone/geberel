const Client = require('../index').client;

Promise.resolve().then(function () {
	return Client();
}).then(function (socket) {

	socket.emit('emit', { hello: 'world' }, function () {
		console.log('emit');
	});

	// socket.request('async', { hello: 'world' }, function (data) {
	// 	console.log(data);
	// });

	socket.request('sync', { hello: 'world' }, function (data) {
		console.log(data);
	});

}).catch(function (error) {
	console.error(error);
});
