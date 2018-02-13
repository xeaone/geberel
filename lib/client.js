'use strict';

const Net = require('net');
const Events = require('events');
const Socket = require('./socket');
const Global = require('../global');

class Client extends Events.EventEmitter {

	constructor (options) {
		super();
		
		options = options || {};

		this.fd = options.fd;
		this.writable = options.writable;
		this.readable = options.readable;
		this.allowHalfOpen = options.allowHalfOpen;

		this.socket = options.socket || {};
		this.path = options.path || Global.path;
		this.client = new Net.Socket(options);

		this.client.on('end', this._end.bind(this));
		this.client.on('drain', this._drain.bind(this));
		this.client.on('error', this._error.bind(this));
		this.client.on('close', this._close.bind(this));
		this.client.on('connect', this._connect.bind(this));
		this.client.on('timeout', this._timeout.bind(this));

		process.on('SIGINT', this._sigint.bind(this));
	}

	_sigint () {
		this.client.end();
		this.client.destroy();
		process.exit(0);
	}

	_end () {
		this.emit('end');
	}

	_drain () {
		this.emit('drain');
	}

	_error (data) {
		this.emit('error', data);
	}

	_close () {
		this.emit('close');
	}

	_open () {
		this.emit('open');
	}

	_connect () {
		this._open();
		const socket = new Socket(this.client, this.socket);
		this.emit('connect', socket);
	}

	_timeout () {
		this.emit('timeout');
	}

	open () {
		this.client.connect(this.path);
		return this;
	}

	close () {
		this.client.end();
		this.client.destroy();
		return this;
	}

}

// module.exports = function (options, callback) {
//
// 	if (!options) {
// 		options = { path: Global.path };
// 	} else if (typeof options === 'function') {
// 		callback = options;
// 		options = { path: Global.path };
// 	}
//
// 	const client = Net.createConnection(options);
//
// 	client.on('error', callback);
//
// 	client.on('connect', function () {
// 		callback(null, new Socket(client, options.socket));
// 	});
//
// 	process.on('SIGINT', function () {
// 		client.end();
// 		process.exit(0);
// 	});
//
// 	return client;
// };

module.exports = Client;
