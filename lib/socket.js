
const Socket = function (WsSocket, autoClose) {
	const self = this;
	self.WsSocket = WsSocket;
	self.autoClose = autoClose || true;
};

Socket.prototype.on = function (eventName, callback) {
	const self = this;

	self._message(eventName, function (error, data) {
		if (error && callback) return callback(error);
		else if (error) throw error;

		var isCallback  = data.callback;

		if (isCallback) {
			eventName = eventName + ':callback';
			delete data.callback;
			data = callback(null, data) || data;
		}

		self._send(eventName, data, function (error) {
			if (error && callback && !isCallback) return callback(error);
			else if (error) throw error;

			self._close(self.autoClose, function (error) {
				if (error && callback && !isCallback) return callback(error);
				else if (error) throw error;

				if (callback && !isCallback) return callback(null, data);
			});
		});
	});

};

Socket.prototype.emit = function (eventName, eventData, callback) {
	const self = this;

	if (callback) eventData.callback = true;
	else eventData.callback = false;

	self._send(eventName, eventData, function (error) {
		if (error && callback) return callback(error);
		else if (error) throw error;

		if (callback) eventName = eventName + ':callback';

		self._message(eventName, function (error, data) {
			if (error && callback) return callback(error);
			else if (error) throw error;

			self._close(self.autoClose, function (error) {
				if (error && callback) return callback(error);
				else if (error) throw error;

				if (callback) return callback(null, data);
			});
		});
	});

};

Socket.prototype.close = function (callback) {
	const self = this;

	self._close(true, function (error) {
		if (error && callback) return callback(error);
		if (callback) return callback();
	});
};

Socket.prototype._message = function (eventName, callback) {
	const self = this;

	self.WsSocket.on('message', function (data) {
		data = JSON.parse(data);

		if (eventName === data.eventName) {
			return callback(null, data.eventData);
		}
	});
};

Socket.prototype._send = function (eventName, eventData, callback) {
	const self = this;

	var data = { eventName: eventName, eventData: eventData };
	data = JSON.stringify(data);

	self.WsSocket.send(data, function () {
		return callback();
	});
};

Socket.prototype._close = function (close, callback) {
	const self = this;

	if (close) {
		self.WsSocket.close();
		self.WsSocket.on('close', function () {
			return callback();
		});
	} else {
		return callback();
	}
};

module.exports = Socket;
