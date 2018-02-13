'use strict';

const Fs = require('fs');
const Net = require('net');
const Path = require('path');
const Events = require('events');
const Socket = require('./socket');
const Global = require('../global');

// TODO need to handle tmp file clean up on error

class Server extends Events.EventEmitter {

	constructor (options) {
		super();

		options = options || {};

		this.sockets = [];
		this.socket = options.socket || { autoEnd: false };
		this.server = new Net.Server(options);
		this.path = options.path || Global.path;

		this.server.on('error', this._error.bind(this));
		this.server.on('close', this._close.bind(this));
		this.server.on('listening', this._open.bind(this));
		this.server.on('connection', this._connect.bind(this));

		process.on('SIGINT', this._sigint.bind(this));
	}

	_sigint () {
		let socket;

		while (socket = this.sockets.shift()) {
			socket.end();
		}

		this.server.close();
		process.exit(0);
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

// Fs.stat(options.path, function (error) {
// 	if (error) {
// 	server = create(options, connections, callback);
// 	} else {
// 		Fs.unlink(options.path, function (error) {
// 			if (error) {
// 				callback(error);
// 			} else {
// 				server = create(options, connections, callback);
// 			}
// 		});
// 	}
// });
