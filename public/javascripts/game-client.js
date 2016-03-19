var GameClient = (function() {

	function GameClient(gameId, playerId) {
		this._socket = io('/' + gameId);
		this._playerId = playerId;

		// set up 
		socket.on('initialize', initialize);
	}

	function initialize(data) {
		console.log("Initialize!" + data);
	}

	Game.prototype.makeMove = function(cellId) {
		socket.emit('move', {playerId: this._playerId, cellId: cellId});
	}

	socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

	return Game;
})();
