(function(exports) {

	const BOARD_COLUMNS = 3;
	const BOARD_ROWS = 3;

	function GameEngine(gameId) {
		this._gameId = gameId;
		this._board = [[0, 0, 0],
					   [0, 0, 0],
					   [0, 0, 0]];
		this._playerOneJoined = false;
		this._playerTwoJoined = false;
	}

	GameEngine.prototype.addPlayer = function() {
		if (this._playerOneJoined && this._playerTwoJoined) {
			throw 'PlayerLimitReached';
		}

		if (!this._playerOneJoined) {
			this._playerOneJoined = true;
			return 1;
		} else {
			this._playerTwoJoined = true;
			return 2;
		}
	}

	GameEngine.prototype.removePlayer = function(playerId) {
		// TODO: validate playerId value is defined, etc.

		if (playerId != 1 && playerId != 2) {
			throw "IllegalPlayerId";
		}

		if (playerId == 1) {
			this._playerOneJoined = false;
			return;
		}

		if (playedId == 2) {
			this._playerTwoJoined = false;
			return;
		}
	}

	GameEngine.prototype.board = function() {
		return this._board;
	}

	GameEngine.prototype.executeMove = function(playerId, cellId) {
		// TODO: validate playerId and cellId values are defined, etc.

		if (playerId != 1 && playerId != 2) {
			throw "IllegalPlayerId";
		}

		if (cellId < 0 || cellId > 8) {
			throw "IllegalCellId";
		}

		var row = Math.floor(cellId/BOARD_COLUMNS);
		var column = cellId % BOARD_ROWS;

		if (this._board[row][column] != 0) {
			throw "CellAlreadyUsed";
		}

		this._board[row][column] = playerId;
	}

	exports.GameEngine = GameEngine;
	return exports;

})(module.exports);
