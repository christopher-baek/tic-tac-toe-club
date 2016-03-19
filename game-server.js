(function(exports) {
	var io = require('socket.io')();
	exports.io = io;

	exports.hello = function() {
		console.log("hello");
	}

	io.on('connection', function(socket) {
		console.log('someone connected!');
	});

})(module.exports);
