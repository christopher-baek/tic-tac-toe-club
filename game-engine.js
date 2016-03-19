(function(exports) {

  const BOARD_COLUMNS = 3;
  const BOARD_ROWS = 3;

  var uuid = require('node-uuid');

  function Game() {
    this._gameId = uuid.v4();
    this._playerCount = 0;
    this._board = [[0, 0, 0],
                   [0, 0, 0],
                   [0, 0, 0]];
    this._currentPlayer = 0;
  }

  Game.prototype.addPlayer = function() {
    if (this._playerCount == 2) {
      throw "PlayerLimitReached";
    } else {
      // the count becomes the player ID
      this._playerCount += 1;
      return this._playerCount;
    }
  }

  Game.prototype.makeMove = function(position, player) {
  	// TODO: check is position and player variables are defined?

  	if (position < 0) {
  		throw "PositionTooLow";
  	}

  	if (position > 8) {
  		throw "PositionTooHigh";
  	}

  	if (player !== 1 || player !== 2) {
  		throw "IllegalPlayerId";
  	}

  	var row = Math.floor(position/BOARD_COLUMNS);
  	var column = position % BOARD_ROWS;

  	this._board[row][column] = player;
  }

  Game.prototype.gameId = function() {
    return this._gameId;
  }

  Game.prototype.playerCount = function() {
    return this._playerCount;
  }

  // export the Game
  exports.Game = Game;
  return exports;

})(module.exports);