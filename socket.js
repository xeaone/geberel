'use strict';

const Socket = function (WsSocket) {
	const self = this;

	self.WsSocket = WsSocket;
};

Socket.prototype.receive = function (_eventName, callback) {
	const self = this;

	const cb = function (data) {
		data._eventName = _eventName;

		self._send(data, function () {
			self.WsSocket.close();
			return;
		});
	};

	self._message(function (data) {
		if (data._eventName === _eventName) {
			delete data._eventName;
			if (callback) return callback(data, cb);
			else return;
		}
	});
};

Socket.prototype.transmit = function (_eventName, data, callback) {
	const self = this;

	data._eventName = _eventName;

	self._send(data, function () {
		if (!callback) { self.WsSocket.close(); return; }

		self._message(function (data) {
			if (data._eventName === _eventName) {
				self.WsSocket.close();
				delete data._eventName;
				return callback(data);
			}
		});
	});
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
		if (callback) callback();
		return;
	});
};

const socket = function (WsSocket) {
	return new Socket (WsSocket);
};

module.exports = socket;
