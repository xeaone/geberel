const Socket = function (WsSocket, autoClose) {
	const self = this;

	self.WsSocket = WsSocket;
	self.autoCloseTotal = 0;
	self.autoCloseCount = 0;
	self.autoClose = autoClose || false;
};

Socket.prototype.receive = function (eventName, callback) {
	const self = this;

	const eventCallback = function (eventData) {
		const payload = {
			eventData: eventData,
			eventName: eventName
		};

		self._send(payload, function () {
			self._close();
			return;
		});
	};

	self.autoCloseTotal++;

	self._message(function (payload) {
		if (payload.eventName === eventName) {
			if (payload.isEventCallback) { return callback(payload.eventData, eventCallback); }
			else { self._close(); return callback(payload.eventData); }
		}
	});
};

Socket.prototype.transmit = function (eventName, eventData, callback) {
	if (typeof eventData === 'function') { callback = eventData; eventData = null; }

	const self = this;
	const isCallback = (callback) ? true : false;

	const payload = {
		eventData: eventData,
		eventName: eventName,
		isEventCallback: isCallback
	};

	self.autoCloseTotal++;

	self._send(payload, function () {
		if (!isCallback) { self._close(); return; }

		self._message(function (payload) {
			if (payload.eventName === eventName) {
				self._close();
				return callback(payload.eventData);
			}
		});
	});
};

Socket.prototype.close = function () {
	const self = this;
	self.WsSocket.close();
};

Socket.prototype._message = function (callback) {
	const self = this;

	self.WsSocket.on('message', function (data) {
		data = JSON.parse(data);
		return callback(data);
	});
};

Socket.prototype._send = function (data, callback) {
	const self = this;

	data = JSON.stringify(data);

	self.WsSocket.send(data, function () {
		return callback();
	});
};

Socket.prototype._close = function () {
	const self = this;

	self.autoCloseCount++;

	if (self.autoClose === true && self.autoCloseTotal === self.autoCloseCount) self.WsSocket.close();
};

module.exports = Socket;
