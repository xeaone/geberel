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
		this.socket = options.socket || {};
		this.path = options.path || Global.path;
		this.allowHalfOpen = options.allowHalfOpen;

		this.client = new Net.Socket({
			fd: this.fd,
			writable: this.writable,
			readable: this.readable,
			allowHalfOpen: this.allowHalfOpen
		});

		this.client.on('end', this._end.bind(this));
		this.client.on('drain', this._drain.bind(this));
		this.client.on('error', this._error.bind(this));
		this.client.on('close', this._close.bind(this));
		this.client.on('connect', this._connect.bind(this));
		this.client.on('timeout', this._timeout.bind(this));

		process.on('SIGINT', this._sigint.bind(this));
	}

	_sigint () {
		this.client.destroy();
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

	close () {
		this.client.destroy();
		return this;
	}

	open () {
		this.client.connect(this.path);
		return this;
	}

}

module.exports = Client;
