(function(exports) {

	var GameEngine = require('./game-engine');
	var uuid = require('node-uuid');
	var io = require('socket.io')();
	exports.io = io;

	var gameEngines = {};

	exports.newGame = function() {
		var gameId = uuid.v4();
		var serverSocket = io.of('/' + gameId);
		var gameEngine = new GameEngine.GameEngine();

		serverSocket.on('connection', function(socket) {
			console.log('received new connection');

			function sendStateToAllPlayers() {
				serverSocket.emit('stateChange', {state: gameEngine.state()});
			}

			socket.on('join', function() {
				console.log('received join request for ' + gameId);

				try {
					var playerId = gameEngine.addPlayer();
					serverSocket.to(socket.id).emit('join', {playerId: playerId});

					console.log('added player ' + playerId);

					sendStateToAllPlayers();
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
					sendStateToAllPlayers();
				} catch(err) {
					console.log('error executing move: ' + err);
					
					serverSocket.to(socket.id).emit(err);
				}
			})

			socket.on('disconnect', function() {
				console.log('user disconnected');

				serverSocket.emit('disconnect');

				delete gameEngines[gameId];
			});
		});

		gameEngines[gameId] = gameEngine;
		return gameId;
	}

	exports.containsGame = function(gameId) {
		return gameId in gameEngines;
	}

})(module.exports);
