# Cherubim #

Is a simple IPC (inter process communicator) but really it is just WebSockets.


## Server ##

```JavaScript
const Cherubim = require('../index');
const Server = Cherubim.server;

const options = { port: 8000 };

Server(options, function (error, Socket) {
	if (error) throw error;

	Socket.receive('event', function (data, callback) {
		data.more = 'works';
		return callback(data);
	});
});
```


## Client ##

```JavaScript
const Cherubim = require('../index');
const Client = Cherubim.client;

const options = { address: 'ws://localhost:8000'};

Client(options, function (error, socket) {
	if (error) throw error;

	Socket.transmit('event', { hello: 'world' }, function (result) {
		console.log(result); // { test: 'stuff', more: 'works' }
	});
});
```


## API ##

* **Herems.client** - 'Options' `Object`, 'Callback' `Function`

	* **Callback** - 'Error' `Object`, 'Socket' `Object`

* **Herems.server** - 'Options' `Object`, 'Callback' `Function`

	* **Callback** - 'Error' `Object`, 'Socket' `Object`

* **Socket.receive** - 'Event' `String`, 'Callback' `Function`

	* **Callback** - 'Data' `Object`, 'Callback' `Function` (optional)

* **Socket.transmit** - 'Event' `String`, 'Data' `Object`, 'Callback' `Function` (optional)

	* **Callback** - 'Data' `Object`


## Terms ##

Basically if you modify this project you have to contribute those modifications back to this project.


## License ##

Licensed Under MPL 2.0

Copyright (c) 2016 [Alexander Elias](https://github.com/AlexanderElias/)
