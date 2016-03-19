(function(exports) {
	// Import Socket.IO and attach it to export
	var io = require('socket.io')();
	exports.io = io;

	// Set up Socket.IO
	io.on('connection', function(socket) {
		console.log('someone connected!');
	});

	// Start a new game
	exports.startNewGame = function() {
		return 69;
	}

})(module.exports);
