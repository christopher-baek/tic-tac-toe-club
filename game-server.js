(function(exports) {

    var GameEngine = require('./game-engine');
    var uuid = require('node-uuid');
    var io = require('socket.io')();
    exports.io = io;

    var games = {};

    /**
     * Creates a new game
     */
    exports.newGame = function() {
        // create a new game, socket, and identifier
        var gameId = uuid.v4();
        var serverSocket = io.of('/' + gameId);
        var gameEngine = new GameEngine.GameEngine(gameId);

        /**
         * A helper function to broadcast the game state to all
         *   connected players
         */
        function sendStateToAllPlayers() {
            serverSocket.emit('stateChange', {state: gameEngine.state()});
        }

        /**
         * When a client connects, set up all the event handling
         */
        serverSocket.on('connection', function(socket) {
            console.log(gameId + ': received new connection');

            /**
             * When a client indicates they are ready to join the game, add
             *   add them to the game and let them know which player they
             *   they are. Broadcast the updated game state to all connected
             *   players
             */
            socket.on('join', function() {
                console.log(gameId + ': received join request');

                try {
                    // add the player and let the client know which player
                    // they are
                    var playerId = gameEngine.addPlayer();
                    serverSocket.to(socket.id).emit('join', {playerId: playerId});

                    sendStateToAllPlayers();
                } catch(err) {
                    console.log(gameId + ': ' + err + ' error adding player');
                    serverSocket.to(socket.id).emit(err);
                }
            });

            /**
             * Execute a move for a player
             */
            socket.on('executeMove', function(data) {
                if (typeof data == 'undefined' || !('playerId' in data) || !('cellId' in data)) {
                    serverSocket.to(socket.id).emit('IllegalMoveData');
                }

                var playerId = data.playerId;
                var cellId = data.cellId;

                console.log(gameId + ': received request from player ' + playerId + ' to execute move at cell ' + cellId);

                try {
                    // execute the move on the engine and instruct the clients
                    // to update their state also
                    gameEngine.executeMove(playerId, cellId);
                    serverSocket.emit('executeMove', {playerId: playerId, cellId: cellId});
                    sendStateToAllPlayers();

                    if (gameEngine.isOver()) {
                        delete games[gameId];
                    }
                } catch(err) {
                    console.log(gameId + ': ' + err + ' error on executing move');
                    serverSocket.to(socket.id).emit(err);
                }
            });

            /**
             * When any client disconnects, send a disconnect event to all
             *   players to terminate the game
             */
            socket.on('disconnect', function() {
                console.log(gameId + ': user disconnected');
                serverSocket.emit('disconnect');
                delete games[gameId];
            });
        });

        // save the game
        games[gameId] = gameEngine;
        return gameId;
    }

    /**
     * Returns true if the server has a game with the given id, otherwise
     *   returns false
     */
    exports.containsGame = function(gameId) {
        return gameId in games;
    }

})(module.exports);
