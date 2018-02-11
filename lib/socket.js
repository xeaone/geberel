'use strict';

const Socket = function (options) {
	options = options || {};

	this.endCount = 0;
	this.socket = options.socket;
	this.encoding = options.encoding || 'utf8';
	this.unref = options.unref === undefined ? false : options.unref;
	this.allowHalfOpen = options.allowHalfOpen === undefined ? true : options.allowHalfOpen;

	if (this.unref) this.socket.unref();
	if (this.encoding) this.socket.setEncoding(this.encoding);
};

Socket.prototype.end = function (callback, end) {
	const self = this;

	if (end === false) {
		callback();
	} else if (end === true || (self.autoClose && self.endCount === 0)) {
		self.socket.on('end', callback);
		self.socket.end();
	} else {
		callback();
	}
};

Socket.prototype.on = function (eventName, callback, end) {
	const self = this;

	self.socket.on('data', function (data) {

		self.endCount--;

		self.end(function () {

			if (callback) {
				data = data.replace(/(\]|\})(\{|\[)/g, '$1___BREAK___$2');
				const packets = data.split('___BREAK___');

				packets.forEach(function (packet) {
					packet = JSON.parse(packet);
					if (packet.eventName === eventName) {
						callback(packet.eventData);
					}
				});

			}

		}, end);
	});

	return self;
};

Socket.prototype.emit = function (eventName, eventData, callback, end) {
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
			callback();
		});
	}, end);

	return self;
};

Socket.prototype.respond = function (eventName, callback) {
	const self = this;

	self.on(eventName, function (data) {
		callback(data, function (data) {
			self.emit(`${eventName}:callback`, data, false);
		});
	});
};

Socket.prototype.request = function (eventName, eventData, callback) {
	const self = this;

	self.emit(eventName, eventData, function () {
		self.on(`${eventName}:callback`, function (data) {
			callback(data);
		});
	});
};

module.exports = Socket;
