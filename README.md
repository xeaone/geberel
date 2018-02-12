# Geberel

An IPC library uses UNIX domains.

## Server
```js
const Geberel = require('geberel');

const options = { path: '/tmp/geberel.sock' };

Geberel.server(options, function (error, socket) {
	if (error) throw error;

	socket.on('test', function (error, data) {
		console.log(data); // { hello: 'people' }
	});

	socket.respond('async', function (error, data, done) {
		setTimeout(function () {
			data.foo = 'bar';
			done(data);
		}, 1000);
	});

});
```

## Client
```js
const Geberel = require('geberel');
const options = { path: '/tmp/geberel.sock' };

Geberel.client(options, function (error, socket) {
	if (error) throw error;

	socket.emit('test', { hello: 'people' }, function (error) {
		// triggers the test event
	});

	socket.request('async', { hello: 'world' }, function (error, data) {
		console.log(data); // { hello: 'world' , foo: bar }
	});

});
```

## State
```js
const Geberel = require('geberel');
const options = { path: '/tmp/geberel.sock' };

Geberel.stat(options, function (stat) {
	console.log(stat); // { connected: true, status: 'ACTIVE' }
});
```

## API

### Geberel.server(options, callback)
- `options: Object`
	- `path: String` UNIX domain socket path. (Default: /tmp/geberel.sock)
	- `allowHalfOpen: Boolean` Indicates whether half-opened TCP connections are allowed. (Default: false)
	- `pauseOnConnect: Boolean`  Indicates whether the socket should be paused on incoming connections. (Default: false)
	- `socket: Object`
		- `allowHalfOpen: Boolean` Indicates whether half-opened TCP connections are allowed. (Default: false)
		- `readable: Boolean` Allow reads on the socket when an fd is passed, otherwise ignored. (Default: false)
		- `writable: Boolean` Allow writes on the socket when an fd is passed, otherwise ignored. (Default: false)
		- `fd: Number` If specified, wrap around an existing socket with the given file descriptor, otherwise a new socket will be created.
- `callback: Function`
	- `error: Error`
	- `socket: Socket`

### Geberel.client(options, callback)
- `options: Object`
	- `path: String` UNIX domain socket path. (Default: /tmp/geberel.sock)
	- `fd: Number` If specified, wrap around an existing socket with the given file descriptor, otherwise a new socket will be created.
	- `allowHalfOpen: Boolean` Indicates whether half-opened TCP connections are allowed. (Default: false)
	- `readable: Boolean` Allow reads on the socket when an fd is passed, otherwise ignored. (Default: false)
	- `writable: Boolean` Allow writes on the socket when an fd is passed, otherwise ignored. (Default: false)
	- `fd: Number` If specified, wrap around an existing socket with the given file descriptor, otherwise a new socket will be created.
- `callback: Function`
	- `error: Error`
	- `socket: Socket`

### Geberel.stat(options, callback)
- `options: Object`
	- `path: String` UNIX domain socket path. (Default: /tmp/geberel.sock)
- `callback: Function`
	- `error: Error`
	- `stat: Object`
		- `error: Error`
		- `connected: Boolean`
		- `status: String` ACTIVE, INACTIVE, ERRORED

### Geberel.socket.on(event, callback)
- `event: String`
- `callback: Function`
	- `data: Object, Array` Parsed using `JSON.parse`.

### Geberel.socket.respond(event, callback)
- `event: String`
- `callback: Function`
	- `done: Function` Accepts data to send back to `Socket.request`.
		- `data: Object, Array` Parsed using `JSON.parse`.

### Geberel.socket.emit(event[, data], callback)
- `event: String`
- `data: Object, Array` Stringified using `JSON.stringify`.
- `callback: Function`

### Geberel.socket.request(event[, data], callback)
- `event: String`
- `data: Object, Array` Stringified using `JSON.stringify`.
- `callback: Function`
