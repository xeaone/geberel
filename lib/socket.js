'use strict';

const Events = require('events');

class Socket { // extends Events.EventEmitter

	constructor (socket, options) {
		options = options || {};

		this.events = {};
		this.endCount = 0;
		this.socket = socket;
		this.encoding = options.encoding || 'utf8';
		this.unref = options.unref === undefined ? false : options.unref;
		this.autoEnd = options.autoEnd === undefined ? true : options.autoEnd;
		this.allowHalfOpen = options.allowHalfOpen === undefined ? false : options.allowHalfOpen;

		if (this.unref) this.socket.unref();
		if (this.encoding) this.socket.setEncoding(this.encoding);

		this.socket.on('data', this._data.bind(this));
	}

	_data (data) {
		const self = this;

		self.socket.on('data', function (data) {
			let packets = data.replace(/(\]|\})(\{|\[)/g, '$1___BREAK___$2').split('___BREAK___');

			for (let packet of packets) {
				packet = JSON.parse(packet);

				if (packet.eventName && packet.eventName in self.events) {
					let methods = self.events[packet.eventName];

					for (let method of methods) {
						method.call(null, packet.eventData);
					}

				}

			}

		});

	}

	end (callback, end) {
		const self = this;

		if (end === false) {
			if (callback) {
				callback();
			}
		} else if (self.autoEnd && self.endCount === 0) {
			self.socket.on('end', callback);
			self.socket.end();
		} else if (callback) {
			callback();
		}

		return self;
	}

	on (eventName, callback, end) {
		const self = this;

		if (!(eventName in self.events)) {
			self.events[eventName] = [];
		}

		self.events[eventName].push(function () {
			const args = arguments;
			self.endCount--;
			self.end(function () {
				if (callback) {
					callback.apply(null, args);
				}
			}, end);
		});

		return self;
	}

	emit (eventName, eventData, callback, end) {
		const self = this;

		if (typeof eventData === 'function') {
			callback = eventData;
			eventData = {};
		}

		var data = {
			eventName: eventName,
			eventData: eventData
		};

		data = JSON.stringify(data);

		self.endCount++;

		self.socket.write(data, function () {
			self.end(function () {
				if (callback) {
					callback();
				}
			}, end);
		});

		return self;
	}

	respond (eventName, callback) {
		const self = this;

		self.on(eventName, function (data) {
			if (callback) {
				callback(data, function (data) {
					self.emit(`${eventName}:callback`, data);
				});
			}
		});

		return self;
	}

	request (eventName, eventData, callback) {
		const self = this;

		self.emit(eventName, eventData, function () {
			self.on(`${eventName}:callback`, function (data) {
				if (callback) {
					callback(data);
				}
			});
		});

		return self;
	}

}

module.exports = Socket;
