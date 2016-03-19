$(function() {

	const BOARD_COLUMNS = 3;
	const BOARD_ROWS = 3;

	var gameId = $('#gameId').val();
	var socket = io('/' + gameId);
	var playerId = null;
	var board = null;
	var playerOneJoined = null;
	var playerTwoJoined = null;

	socket.on('initialize', function(data) {
		console.log('received initialization data');

		playerId = data.playerId;
		board = data.board;
		playerOneJoined = data.playerOneJoined;
		playerTwoJoined = data.playerTwoJoined;
	});

	socket.on('executeMove', function(playerId, cellId) {
		console.log('received command to execute move for ' + playerId + ' at cell ' + cellId);

		var row = Math.floor(cellId/BOARD_COLUMNS);
		var column = cellId % BOARD_ROWS;
		board[row][column] = playerId;
	});

	function executeMove(cellId) {
		console.log('executing move request for ' + playerId + ' at cell ' + cellId);
		socket.emit('executeMove', playerId, cellId);
	}

	// set up the game board
	$('.cell').click(function() {
		var cellId = $(this).attr('id');
		executeMove(cellId);
	});

	// add the URL for sharing
	$('#url').val(document.URL);
	$('#url').attr('size', document.URL.length)

	console.log('executing join request');
	socket.emit('join');

});
