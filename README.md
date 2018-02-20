
# Geberel

An IPC library uses UNIX domains.

## Server
```js
const Geberel = require('geberel');
const options = { path: '/tmp/geberel.sock' };
const server = new Geberel.server(options);

server.on('error', function (error) {
	console.log(error);
});

server.on('connect', function (socket) {

	socket.on('error', function (error) {
		console.log(error);
	});

	socket.when('test', function (data) {
		console.log(data); // { hello: 'people' }
	});

	socket.respond('async', function (data, done) {
		setTimeout(function () {
			data.foo = 'bar';
			done(data);
		}, 1000);
	});

});

server.open();
```

## Client
```js
const Geberel = require('geberel');
const options = { path: '/tmp/geberel.sock' };
const client = new Geberel.client(options);

client.on('error', function (error) {
	console.log(error);
});

client.on('connect', function (socket) {

	client.on('error', function (error) {
		console.log(error);
	});

	socket.relay('test', { hello: 'people' }, function (error) {
		// triggers the test event
	});

	socket.request('async', { hello: 'world' }, function (error, data) {
		console.log(data); // { hello: 'world' , foo: bar }
	});

});

client.open();
```

## API

### Geberel.server(options, callback)
Extends the Events.EventEmitter class.
- `options: Object`
	- `path: String` UNIX domain socket path. (Default: /tmp/geberel.sock)
	- `allowHalfOpen: Boolean` Indicates whether half-opened TCP connections are allowed. (Default: false)
	- `pauseOnConnect: Boolean`  Indicates whether the socket should be paused on incoming connections. (Default: false)
	- `socket: Object`
		- `autoClose: Boolean` Defaults to true.
		- `allowHalfOpen: Boolean` Indicates whether half-opened TCP connections are allowed. (Default: false)
		- `readable: Boolean` Allow reads on the socket when an fd is passed, otherwise ignored. (Default: false)
		- `writable: Boolean` Allow writes on the socket when an fd is passed, otherwise ignored. (Default: false)
		- `fd: Number` If specified, wrap around an existing socket with the given file descriptor, otherwise a new socket will be created.
- `close: Function`
- `open: Function`
- Events
	- error
	- open
	- close
	- connect

### Geberel.client(options, callback)
Extends the Events.EventEmitter class.
- `options: Object`
	- `socket: Object`
		- `autoClose: Boolean` Defaults to true.
	- `path: String` UNIX domain socket path. (Default: /tmp/geberel.sock)
	- `fd: Number` If specified, wrap around an existing socket with the given file descriptor, otherwise a new socket will be created.
	- `allowHalfOpen: Boolean` Indicates whether half-opened TCP connections are allowed. (Default: false)
	- `readable: Boolean` Allow reads on the socket when an fd is passed, otherwise ignored. (Default: false)
	- `writable: Boolean` Allow writes on the socket when an fd is passed, otherwise ignored. (Default: false)
	- `fd: Number` If specified, wrap around an existing socket with the given file descriptor, otherwise a new socket will be created.
- `close: Function`
- `open: Function`
- Events
	- end
	- drain
	- error
	- open
	- close
	- connect
	- timeout

### Geberel.socket([socket]\[, options])
Extends the Events.EventEmitter class.
- `socket: Net.Socket`
- `options: Object`
	- `unref: Boolean` Defaults to false.
	- `encoding: String` Defaults to utf8.
	- `autoClose: Boolean` Defaults to true.
- `when: Function`
	- `event: String`
	- `callback: Function`
		- `data: Object, Array` Parsed using `JSON.parse`.
- `respond: Function`
	- `event: String`
	- `callback: Function`
		- `done: Function` Accepts data to send back to `Socket.request`.
			- `data: Object, Array` Parsed using `JSON.parse`.
- `relay: Function`
	- `event: String`
	- `data: Object, Array` Stringified using `JSON.stringify`.
	- `callback: Function`
- `request: Function`
	- `event: String`
	- `data: Object, Array` Stringified using `JSON.stringify`.
	- `callback: Function`
- Events
	- end
	- error
	- close

## Authors
[AlexanderElias](https://github.com/AlexanderElias)

## License
[Why You Should Choose MPL-2.0](http://veldstra.org/2016/12/09/you-should-choose-mpl2-for-your-opensource-project.html)
This project is licensed under the MPL-2.0 License
