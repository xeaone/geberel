const Server = require('../index').server;

Promise.resolve().then(function () {
	return Server();
}).then(function (socket) {

	socket.on('emit', function (data) {
		console.log(data);
	});

	// socket.respond('async', function (data, done) {
	// 	setTimeout(function () {
	// 		data.more = 'async';
	// 		done(data);
	// 	}, 1000);
	// });

	socket.respond('sync', function (data, done) {
		data.more = 'sync';
		done(data);
	});

}).catch(function (error) {
	console.error(error);
});
