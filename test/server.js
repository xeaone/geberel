const Server = require('../index').server;

Server(function (error, socket) {
	if (error) throw error;

	socket.on('test',
		function (data) {
			data.more = 'what';
			return data;
		},
		function (error) {
			if (error) throw error;
			console.log('done');
		}
	);

});
