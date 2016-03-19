(function(exports) {
	var engine = require('./game-engine');

	// Import Socket.IO and attach it to export
	var io = require('socket.io')();
	exports.io = io;

	// Set up Socket.IO
	io.on('connection', function(socket) {
		console.log('someone connected!');
	});

	var games = {};

	exports.startNewGame = function() {
		var game = new engine.Game();
		var gameId = game.gameId();

		games[gameId] = game;

		return gameId;
	}

	exports.gameExists = function(gameId) {
		return gameId in games;
	}

	exports.addPlayer = function(gameId) {
		var playerId = games[gameId].addPlayer();
		console.log(games[gameId].playerCount() + ' players');
		console.log("this is player " + playerId);
		return playerId;
	}

})(module.exports);
