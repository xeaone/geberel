# Geberel #

A simple IPC (inter process communicator) but really it is just WebSockets. Short simple and sweet.


## Server ##

```JavaScript
const Geberel = require('geberel');
const Server = Geberel.server;

const options = { port: 8000 };

Server(options, function (error, socket) {
	if (error) throw error;

	socket.on('test', function (error, data) {
		console.log(data); // { hello: 'people' }
		data.hello = 'world';
	});

	socket.respond('async', function (error, data, done) {
		setTimeout(function () {
			data.more = 'async';
			done(data);
		}, 1000);
	});

});
```


## Client ##

```JavaScript
const Geberel = require('geberel');
const Client = Geberel.client;

const options = { address: 'ws://localhost:8000', autoClose: true };

Client(options, function (error, socket) {
	if (error) throw error;

	socket.emit('test', { hello: 'people' }, function (error, data) {
		console.log(data); // { hello: 'people' }
	});

	socket.request('async', { hello: 'world' }, function (error, data) {
		console.log(data);
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
If `Socket.emit` is provided a callback then it will expect data to be returned by the `Socket.on` callback. Other wise it will act just like event listeners and triggers. Auto closing sockets is `true` be default.

- **Geberel.client** 'Options' `Object`, 'Callback' `Function`
	- **Callback** 'Error' `Object`, 'Socket' `Object`

- **Geberel.server** 'Options' `Object`, 'Callback' `Function`
	- **Callback** 'Error' `Object`, 'Socket' `Object`

- **Socket.on** 'Event' `String`, 'Callback' `Function`
	- **Callback** 'Data' `Object || Array || String`

- **Socket.emit** 'Event' `String`, 'Data' `Object` (optional), 'Callback' `Function` (optional)
	- **Callback** 'Data' `Object || Array || String`

- **Socket.respond** 'Event' `String`, 'Callback' `Function`
	- **Callback** 'Data' `Object || Array || String`, 'Done' `Function`
		- **Done** Accepts data to send back to the `Socket.request`.

- **Socket.request** 'Event' `String`, 'Data' `Object`, 'Callback' `Function`
	- **Callback** 'Data' `Object || Array || String` sent from the `Socket.respond`.


## Options ##

**Geberel.server**
- `port` Number **Default: 8000**
- `host` String **Default: 127.0.0.1**
- `server` http.Server
- `verifyClient` Function
- `handleProtocols` Function
- `path` String
- `noServer` Boolean
- `disableHixie` Boolean
- `clientTracking` Boolean
- `perMessageDeflate` Boolean|Object

**Geberel.client**
- `address` String **Default: ws://localhost:8000**
- `autoClose` Boolean (closes all client sockets after completion) **Default: true**
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
