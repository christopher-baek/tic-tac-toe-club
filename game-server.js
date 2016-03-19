(function(exports) {

	var GameEngine = require('./game-engine');
	var uuid = require('node-uuid');
	var io = require('socket.io')();
	exports.io = io;

	var gameEngines = {};

	exports.newGame = function() {
		var gameId = uuid.v4();
		var serverSocket = io.of('/' + gameId);
		var gameEngine = new GameEngine.GameEngine(gameId);

		serverSocket.on('connection', function(socket) {
			socket.on('join', function() {
				console.log('received join request for ' + gameId);

				try {
					var playerId = gameEngine.addPlayer();

					serverSocket.to(socket.id).emit('initialize', {
						playerId: playerId,
						board: gameEngine.board()
					});

					console.log('added player ' + playerId);
				} catch(err) {
					console.log('error adding player: ' + err);

					serverSocket.to(socket.id).emit(err);
				}
			});

			socket.on('executeMove', function(playerId, cellId) {
				console.log('received request to execute move for ' + playerId + ' at cell ' + cellId);

				try {
					gameEngine.executeMove(playerId, cellId);
					serverSocket.emit('executeMove', playerId, cellId);
				} catch(err) {
					console.log('error executing move: ' + err);
					
					serverSocket.to(socket.id).emit(err);
				}
			})
		});

		gameEngines[gameId] = gameEngine;
		return gameId;
	}

	exports.containsGame = function(gameId) {
		return gameId in gameEngines;
	}

})(module.exports);
