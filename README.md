# Geberel #

A simple IPC (inter process communicator) but really it is just WebSockets. Short simple and sweet.


## Server ##

```JavaScript
const Geberel = require('geberel');
const Server = Geberel.server;

const options = { port: 8000 };

Server(options, function (error, socket) {
	if (error) throw error;

	socket.receive('test', function (data, callback) {
		console.log(data); // { hello: 'people' }
		data.hello = 'world';
		return callback(data);
	});

	socket.transmit('another', 'cool thing');
});
```


## Client ##

```JavaScript
const Geberel = require('geberel');
const Client = Geberel.client;

const options = { address: 'ws://localhost:8000', autoClose: false };

Client(options, function (error, socket) {
	if (error) throw error;

	socket.transmit('test', { hello: 'people' }, function (data) {
		console.log(data); // { hello: 'world' }
	});

	socket.receive('another', function (data) {
		console.log(data); // cool thing
	});
});

```


## State ##

```JavaScript
const Geberel = require('geberel');
const State = Geberel.state;

const options = { address: 'ws://localhost:8000' };

State(options, function (result) {
	if (result.error) console.log(result);
	else console.log(result); // { connected: true, status: 'ACTIVE' }
});
```


## API ##

- **Geberel.client** - 'Options' `Object`, 'Callback' `Function`
	- **Callback** - 'Error' `Object`, 'Socket' `Object`

- **Geberel.server** - 'Options' `Object`, 'Callback' `Function`
	- **Callback** - 'Error' `Object`, 'Socket' `Object`

- **Socket.on** - 'Event' `String`, 'Callback' `Function`
	- **Callback** - 'Data' `Any`, 'Callback' `Function` (optional)

- **Socket.emit** - 'Event' `String`, 'Data' `Object`, 'Callback' `Function` (optional)
	- **Callback** - 'Data' `Any`


## Options ##

- **Geberel.server**
	- `port` Number **Default: 8000**
	- `host` String
	- `server` http.Server
	- `verifyClient` Function
	- `handleProtocols` Function
	- `path` String
	- `noServer` Boolean
	- `disableHixie` Boolean
	- `clientTracking` Boolean
	- `perMessageDeflate` Boolean|Object

- **Geberel.client**
	- `address` String **Default: ws://localhost:8000**
	- `autoClose` Boolean (closes all client sockets after completion) **Default: false**
	- `protocol` String
	- `agent` Agent
	- `headers` Object
	- `protocolVersion` Number|String
	- These following only apply if address is a String
		- `host` String
		- `origin` String
		- `pfx` String|Buffer
		- `key` String|Buffer
		- `passphrase` String
		- `cert` String|Buffer
		- `ca` Array
		- `ciphers` String
		- `rejectUnauthorized` Boolean
		- `perMessageDeflate` Boolean|Object
		- `localAddress` String
