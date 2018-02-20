'use strict';

const Net = require('net');
const Events = require('events');

class Socket extends Events.EventEmitter {

	constructor (socket, options) {
		super();

		if (socket) {
			if (socket.constructor.name === 'Socket') {
				options = options || {};
			} else if (socket.constructor.name === 'Object') {
				options = socket;
			}
		} else {
			socket = new Net.Socket();
			options = options || {};
		}

		this.closeCount = 0;
		this.socket = socket;
		this.encoding = options.encoding || 'utf8';
		this.unref = options.unref === undefined ? false : options.unref;
		this.autoClose = options.autoClose === undefined ? true : options.autoClose;

		if (this.unref) this.socket.unref();
		if (this.encoding) this.socket.setEncoding(this.encoding);

		this.socket.on('end', this._end.bind(this));
		this.socket.on('data', this._data.bind(this));
		this.socket.on('error', this._error.bind(this));
		this.socket.on('close', this._close.bind(this));
	}

	_error (error) {
		this.emit('error', error);
	}

	_end () {
		this.emit('end');
	}

	_close () {
		this.emit('close');
	}

	_data (data) {
		const self = this;

		let packets = data.replace(/(\]|\})(\{|\[)/g, '$1___BREAK___$2').split('___BREAK___');

		for (let packet of packets) {
			packet = JSON.parse(packet);

			if (packet.eventName) {
				self.emit(packet.eventName, packet.eventData);
			}

		}

	}

	close (callback, close) {
		const self = this;

		self.closeCount--;

		if (close === false) {
			if (callback) {
				callback();
			}
		} else if (self.autoClose && self.closeCount === 0) {
			self.socket.on('close', callback);

			self.socket.on('end', function () {
				self.socket.destroy();
			});

			self.socket.end();
		} else if (callback) {
			callback();
		}

		return self;
	}

	when (eventName, callback, close) {
		const self = this;

		self.closeCount++;

		self.on(eventName, function () {
			const args = arguments;

			self.close(function () {

				if (callback) {
					callback.apply(null, args);
				}

			}, close);

		});

		return self;
	}

	relay (eventName, eventData, callback, close) {
		const self = this;

		self.closeCount++;

		if (typeof eventData === 'function') {
			callback = eventData;
			eventData = {};
		}

		if (typeof callback === 'boolean') {
			close = callback;
			callback = null;
		}

		var data = {
			eventName: eventName,
			eventData: eventData
		};

		data = JSON.stringify(data);

		self.socket.write(data, function () {

			self.close(function () {

				if (callback) {
					callback();
				}

			}, close);

		});

		return self;
	}

	respond (eventName, callback) {
		const self = this;

		self.when(eventName, function (data) {

			if (callback) {

				callback(data, function (data) {
					self.relay(`${eventName}:callback`, data);
				});

			}

		});

		return self;
	}

	request (eventName, eventData, callback) {
		const self = this;

		self.relay(eventName, eventData, function () {

			self.when(`${eventName}:callback`, function (data) {

				if (callback) {
					callback(data);
				}

			});

		});

		return self;
	}

}

module.exports = Socket;
