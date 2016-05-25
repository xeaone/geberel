'use strict';

const State = require('../index').state;

const options = { address: 'ws://localhost:7777' };

State(options, function (result) {
	if (result.error) console.log(result);
	else console.log(result);
});
