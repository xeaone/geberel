const Client = require('../index').client;

Client(function (error, socket) {
	if (error) throw error;

	socket.emit('test', { test: 'stuff' }, function (error, data) {
		if (error) throw error;
		console.log(data);
	});

});
