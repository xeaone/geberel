
const Socket = function (options) {
	options = options || {};

	this.endCount = 0;
	this.socket = options.socket;
	// this.autoEnd = options.autoEnd || true;
	this.encoding = options.encoding || 'utf8';
	this.autoClose = options.autoClose || true;

	this.socket.setEncoding(this.encoding);
};

Socket.prototype.close = function (callback) {
	const self = this;

	if (self.autoClose && self.closeCount === 0) {
		if (callback) self.socket.on('close', callback);
		self.socket.unref();
		self.socket.end();
		self.socket.destroy();
	} else {
		if (callback) callback();
	}
};

Socket.prototype.on = function (eventName, callback) {
	const self = this;

	self.closeCount++;

	self.socket.on('data', function (data) {
		data = data.toString();
		data = JSON.parse(data);

		if (data.eventName === eventName) {
			self.close(function () {
				self.closeCount--;
				if (callback) callback(data.eventData);
			});
		}

	});
};

Socket.prototype.emit = function (eventName, eventData, callback) {
	const self = this;

	self.closeCount++;

	if (typeof eventData === 'function') {
		callback = eventData;
		eventData = {};
	}

	var data = {
		eventName: eventName,
		eventData: eventData
	};

	data = JSON.stringify(data);

	self.socket.write(data, function () {
		self.close(function () {
			self.closeCount--;
			if (callback) callback(data.eventData);
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
