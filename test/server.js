const Server = require('../index').server;

Server(function (error, socket) {
	if (error) throw error;

	socket.on('test', function (error, data) {
		if (error) throw error;
		data.more = 'what';
	});

});
