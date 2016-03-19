(function(exports) {

	const BOARD_COLUMNS = 3;
	const BOARD_ROWS = 3;

	function GameEngine(gameId, socket) {
		this._gameId = gameId;
		this._socket = socket;
		this._board = [[0, 0, 0],
					   [0, 0, 0],
					   [0, 0, 0],];
		this._playerCount = 0;
	}

	GameEngine.prototype.addPlayer = function() {
		if (this._playerCount == 2) {
			throw "PlayerLimitReached";
		}

		// the count becomes the player ID
		this._playerCount += 1;
		return this._playerCount;
	}

	GameEngine.prototype.executeMove = function(playerId, cellId) {
		// TODO: validate playerId and cellId values

		if (playerId != 1 && playerId != 2) {
			throw "IllegalPlayerId";
		}

		if (cellId < 0 || cellId > 8) {
			throw "IllegalCellId";
		}

		var row = Math.floor(position/BOARD_COLUMNS);
		var column = position % BOARD_ROWS;

		this._board[row][column] = player;
	}

	exports.GameEngine = GameEngine;
	return exports;
	
})(module.exports);