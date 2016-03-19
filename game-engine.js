(function(exports) {

	const BOARD_COLUMNS = 3;
	const BOARD_ROWS = 3;

	const STATE_NEW = 'STATE_NEW';
	const STATE_WAITING_FOR_PLAYER_TWO = 'STATE_WAITING_FOR_PLAYER_TWO';
	const STATE_PLAYER_ONE_MOVE = 'PLAYER_ONE_MOVE';
	const STATE_PLAYER_TWO_MOVE = 'PLAYER_TWO_MOVE';
	const STATE_DONE = 'STATE_DONE';

	function GameEngine() {
		this._board = [[0, 0, 0],
					   [0, 0, 0],
					   [0, 0, 0]];
		this._state = STATE_NEW;
	}

	GameEngine.prototype.addPlayer = function() {
		if (this._state == STATE_NEW) {
			console.log('player 1 has joined');

			this._state = STATE_WAITING_FOR_PLAYER_TWO;

			return 1;
		} else if (this._state == STATE_WAITING_FOR_PLAYER_TWO) {
			console.log('player 2 has joined');

			this._state = STATE_PLAYER_ONE_MOVE;

			return 2;
		} else {
			throw 'IllegalStateToAddPlayer';
		}
	}

	GameEngine.prototype.executeMove = function(playerId, cellId) {
		// TODO: validate playerId and cellId values are defined, etc.

		if (this._state != STATE_PLAYER_ONE_MOVE && this._state != STATE_PLAYER_TWO_MOVE) {
			throw 'IllegalStateToExecuteMove';
		}

		if (playerId != 1 && playerId != 2) {
			throw 'IllegalPlayerId';
		}

		if (cellId < 0 || cellId > 8) {
			throw 'IllegalCellId';
		}

		if ((this._state == STATE_PLAYER_ONE_MOVE && playerId != 1) ||
			(this._state == STATE_PLAYER_TWO_MOVE && playerId != 2)) {
			throw 'IncorrectPlayerTurn';
		}

		var row = Math.floor(cellId/BOARD_COLUMNS);
		var column = cellId % BOARD_ROWS;

		if (this._board[row][column] != 0) {
			throw 'CellAlreadyPlayed';
		}

		console.log('executing move for ' + playerId + ' at cell ' + cellId);
		this._board[row][column] = playerId;

		if (playerId == 1) {
			this._state = STATE_PLAYER_TWO_MOVE;
		} else if (playerId == 2) {
			this._state = STATE_PLAYER_ONE_MOVE;
		} else {
			throw 'IllegalStateError';
		}

		return this._checkForWin();
	}

	GameEngine.prototype._checkForWin = function() {
		console.log('checking for win...');

		for (var rowId = 0; rowId < BOARD_ROWS; rowId++) {
			var playerId = this._checkRowForWin(rowId);
			if (playerId != 0) {
				return playerId;
			}
		}

		for (var columnId = 0; columnId < BOARD_COLUMNS; columnId++) {
			var playerId = this._checkColumnForWin(columnId);
			if (playerId != 0) {
				return playerId;
			}
		}

		var playerId = this._checkDiagonalsForWin();

		if (playerId != 0) {
			console.log(playerId + ' has won the game');
			this._state = STATE_DONE;
		} else {
			console.log('game has not been won');
		}

		return playerId;
	}

	GameEngine.prototype._checkRowForWin = function(rowId) {
		console.log('checking row ' + rowId + ' for win...');

		var values = this._board[rowId];

		return this.__checkValuesForWin(values);
	}

	GameEngine.prototype._checkColumnForWin = function(columnId) {
		console.log('checking column ' + columnId + ' for win...');

		var values = [];

		for (var rowId = 0; rowId < BOARD_ROWS; rowId++) {
			values.push(this._board[rowId][columnId]);
		}

		return this.__checkValuesForWin(values);
	}

	GameEngine.prototype._checkDiagonalsForWin = function(startingCellId) {
		console.log('checking back diagonal for win');

		var values = [];

		values.push(this._board[0][0]);
		values.push(this._board[1][1]);
		values.push(this._board[2][2]);

		var playerId = this.__checkValuesForWin(values);

		if (playerId != 0) {
			return playerId;
		}

		console.log('checking forward diagonal for win');

		values = []

		values.push(this._board[0][2]);
		values.push(this._board[1][1]);
		values.push(this._board[2][0]);

		return this.__checkValuesForWin(values);
	}

	GameEngine.prototype.__checkValuesForWin = function(values) {
		if (values[0] != 0) {
			if (values[0] == values[1] && values[1] == values[2]) {
				return values[0];
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	}

	GameEngine.prototype.state = function() {
		return this._state;
	}

	exports.GameEngine = GameEngine;
	return exports;

})(module.exports);
