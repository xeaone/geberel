'use strict';

const Fs = require('fs');
const Net = require('net');
const Path = require('path');
const Events = require('events');
const Socket = require('./socket');
const Global = require('../global');

class Server extends Events.EventEmitter {

	constructor (options) {
		super();

		options = options || {};

		this.sockets = [];
		this.path = options.path || Global.path;
		this.allowHalfOpen = options.allowHalfOpen;
		this.pauseOnConnect = options.pauseOnConnect;
		this.socket = options.socket || { autoClose: false };

		this.server = new Net.Server({
			allowHalfOpen: this.allowHalfOpen,
			pauseOnConnect: this.pauseOnConnect
		});

		this.server.on('error', this._error.bind(this));
		this.server.on('close', this._close.bind(this));
		this.server.on('listening', this._open.bind(this));
		this.server.on('connection', this._connect.bind(this));

		process.on('exit', this._exit.bind(this));
		process.on('SIGINT', this._sigint.bind(this));
		process.on('uncaughtException', this._uncaughtException.bind(this));
	}

	_exit (code) {
		if (code !== 666) {
			try {
				Fs.unlinkSync(this.path);
			} catch (e) {
				if (e.code !== 'ENOENT') {
					throw e;
				}
			}
		}
	}

	_uncaughtException (error) {

		console.error(error.stack);

		if (error.code === 'EADDRINUSE') {
			process.exit(666);
		}

	}

	_sigint () {
		let socket;

		while (socket = this.sockets.shift()) {
			socket.close();
		}

		this.server.close();
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

	_connect (data) {
		const socket = new Socket(data, this.socket);
		this.sockets.push(socket);
		this.emit('connect', socket);
	}

	close () {
		this.server.close();
		return this;
	}

	open () {
		this.server.listen(this.path);
		return this;
	}

}

module.exports = Server;
