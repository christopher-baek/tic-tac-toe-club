(function(exports) {
	var uuid = require('node-uuid');

	// Import Socket.IO and attach it to export
	var io = require('socket.io')();
	exports.io = io;

	// Set up Socket.IO
	io.on('connection', function(socket) {
		console.log('someone connected!');
	});

	var games = {};

	exports.startNewGame = function() {
		var gameId = uuid.v4();
		games[gameId] = 0;
		return gameId;
	}

	exports.gameExists = function(gameId) {
		return gameId in games;
	}

	exports.addPlayer = function(gameId) {
		games[gameId] += 1;
		console.log(games[gameId] + ' players');
	}

})(module.exports);
