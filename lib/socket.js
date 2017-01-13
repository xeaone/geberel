
const Socket = function (socket, autoClose) {
	const self = this;
	self.closeCount = 0;
	self.socket = socket;
	self.autoClose = autoClose || true;
};

Socket.prototype.close = function (close, callback) {
	const self = this;

	if (typeof close === 'function') {
		callback = close;
		close = true;
	}

	if (close) {
		self.socket.on('close', function () {
			if (callback) return callback();
		});

		self.socket.close();
	} else {
		if (callback) return callback();
	}
};

Socket.prototype.on = function (eventName, callback) {
	const self = this;

	self.closeCount++;

	self.socket.on('message', function (data) {

		try { data = JSON.parse(data); }
		catch (e) {/*ignore*/}

		if (data.eventName === eventName) {
			self.closeCount--;
			self.close(self.autoClose && self.closeCount === 0);
			if (callback) return callback(data.eventData);
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

	try { data = JSON.stringify(data); }
	catch (e) {/*ignore*/}

	self.socket.send(data, function () {
		self.closeCount--;
		self.close(self.autoClose && self.closeCount === 0);
		if (callback) return callback(data.eventData);
	});
};

Socket.prototype.respond = function (eventName, callback) {
	const self = this;

	self.closeCount++;

	self.on(eventName, function (data) {
		return callback(data, function (data) {
			self.closeCount--;
			self.emit(eventName + ':callback', data);
			self.close(self.autoClose && self.closeCount === 0);
		});
	});
};

Socket.prototype.request = function (eventName, eventData, callback) {
	const self = this;

	self.closeCount++;

	self.emit(eventName, eventData, function () {
		self.on(eventName + ':callback', function (data) {
			self.closeCount--;
			self.close(self.autoClose && self.closeCount === 0);
			return callback(data);
		});
	});
};

module.exports = Socket;
