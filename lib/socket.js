'use strict';

const Socket = function (options) {
	options = options || {};

	this.closeCount = 0;
	this.socket = options.socket;
	this.encoding = options.encoding || 'utf8';
	this.autoClose = options.autoClose || true;
	// this.allowHalfOpen = options.allowHalfOpen || true;
	
	// this.socket.unref();
	this.socket.setEncoding(this.encoding);
};

Socket.prototype.close = function (callback) {
	const self = this;

	if (self.autoClose && self.closeCount === 0) {
		if (callback) self.socket.on('end', callback);
		self.socket.end();
	} else {
		if (callback) callback();
	}
};

Socket.prototype.on = function (eventName, callback) {
	const self = this;

	self.closeCount++;

	self.socket.on('data', function (data) {
		self.close(function () {
			self.closeCount--;

			if (callback) {
				data = data.toString();
				data = JSON.parse(data);
				if (data.eventName === eventName) {
					callback(data.eventData);
				}
			}

		});
	});

};

Socket.prototype.emit = function (eventName, eventData, callback) {
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

	self.closeCount++;

	self.socket.write(data, function () {
		self.close(function () {
			self.closeCount--;
			if (callback) callback();
		});
	});
};

Socket.prototype.respond = function (eventName, callback) {
	const self = this;

	self.on(eventName, function (data) {
		callback(data, function (data) {
			self.emit(`${eventName}:callback`, data);
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
