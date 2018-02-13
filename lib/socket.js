'use strict';

class Socket {

	constructor (socket, options) {
		options = options || {};

		this.endCount = 0;
		this.socket = socket;
		this.encoding = options.encoding || 'utf8';
		this.unref = options.unref === undefined ? false : options.unref;
		this.autoEnd = options.autoEnd === undefined ? true : options.autoEnd;
		this.allowHalfOpen = options.allowHalfOpen === undefined ? false : options.allowHalfOpen;

		if (this.unref) this.socket.unref();
		if (this.encoding) this.socket.setEncoding(this.encoding);
	}

	end (callback, end) {
		const self = this;

		if (end === false) {
			callback();
		} else if (self.autoEnd && self.endCount === 0) {
			console.log('end');
			self.socket.on('end', callback);
			self.socket.end();
		} else {
			callback();
		}

		return self;
	}

	on (eventName, callback, end) {
		const self = this;

		self.socket.on('data', function (data) {

			// self.endCount--;

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

		// self.endCount++;

		self.socket.write(data, function () {
			self.end(function () {
				callback();
			}, end);
		});

		return self;
	}

	respond (eventName, callback) {
		const self = this;

		self.on(eventName, function (data) {
			console.log(`respond ${eventName}`);
			callback(data, function (data) {
				console.log(`respond ${eventName}:callback`);
				self.emit(`${eventName}:callback`, data, true);
			});
		}, false);

		return self;
	}

	request (eventName, eventData, callback) {
		const self = this;

		// self.endCount++;

		self.emit(eventName, eventData, function () {
			console.log(`request ${eventName}`);
			// self.endCount--;
			self.on(`${eventName}:callback`, function (data) {
				console.log(`request ${eventName}:callback`);
				callback(data);
			}, true);
		}, false);

		return self;
	}

}

module.exports = Socket;
