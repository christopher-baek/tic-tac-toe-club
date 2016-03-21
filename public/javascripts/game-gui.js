$(function() {

    /**
     * constants defining the dimensions of the game board
     */
    const BOARD_COLUMNS = 3;
    const BOARD_ROWS = 3;

    /**
     * the game states
     */
    const STATE_NEW = 'STATE_NEW';
    const STATE_WAITING_FOR_PLAYER_TWO = 'STATE_WAITING_FOR_PLAYER_TWO';
    const STATE_PLAYER_ONE_MOVE = 'PLAYER_ONE_MOVE';
    const STATE_PLAYER_TWO_MOVE = 'PLAYER_TWO_MOVE';
    const STATE_PLAYER_ONE_WINS = 'PLAYER_ONE_WINS';
    const STATE_PLAYER_TWO_WINS = 'PLAYER_TWO_WINS';

    /**
     * the client state variables
     */
    var gameId = $('#gameId').val();
    var socket = io('/' + gameId);
    var playerId = null;
    var state = null;
    var board = [[0, 0, 0],
                 [0, 0, 0],
                 [0, 0, 0]];


    /**
     * When the server acknowledges a join, it will send the player ID
     */
    socket.on('join', function(data) {
        // TODO: validate arguments
        playerId = data.playerId;

        onJoin();
    });

    /**
     * When the server sends instructions to execute a move, update the board
     */
    socket.on('executeMove', function(data) {
        // TODO: validate arguments
        var playerId = data.playerId;
        var cellId = data.cellId;

        // translate the cell id to board dimensions
        var row = Math.floor(cellId/BOARD_COLUMNS);
        var column = cellId % BOARD_ROWS;

        // TODO: client side handling that this is valid like on the engine?
        board[row][column] = playerId;

        onExecuteMove(playerId, cellId);
    });

    /**
     * When the server send a notification about a state change, update
     *   the internal state
     */
    socket.on('stateChange', function(data) {
        // TODO: validate arguments
        state = data.state;

        onStateChange();
    });

    /**
     * Send a move request to the server
     */
    function sendExecuteMoverequest(cellId) {
        socket.emit('executeMove', {playerId: playerId, cellId: cellId});
    }

    /**
     * Executed when a join ack is received from the server
     */
    function onJoin() {
        $('#playerId').text('You are player ' + playerId);
    }

    /**
     * Executed when a move instruction is received from the server
     */
    function onExecuteMove(playerId, cellId) {
        var marker;

        if (playerId == 1) {
            marker = 'X';
        } else if (playerId == 2) {
            marker = 'O';
        } else {
            alert('unexpected problem executing move');
        }

        $('#' + cellId).text(marker);
        $('#' + cellId).removeClass('empty');
        $('#' + cellId).unbind('click');
    }

    /**
     * Executed when a state change is received from the server
     */
    function onStateChange() {
        if (state == STATE_WAITING_FOR_PLAYER_TWO) {
            $('#status').text('Waiting for player 2 to join...');
        } else if (state == STATE_PLAYER_ONE_MOVE) {
            $('#player1').addClass('active');
            $('#player2').removeClass('active');
            $('#status').text('Waiting for player 1 to make a move...');
        } else if (state == STATE_PLAYER_TWO_MOVE) {
            $('#player1').removeClass('active');
            $('#player2').addClass('active');
            $('#status').text('Waiting for player 2 to make a move...');
        } else if (state == STATE_PLAYER_ONE_WINS) {
            $('#player1').addClass('winner');
            $('#player2').addClass('disabed');
            disableAllCells();
            $('#status').text('Player 1 wins!');
        } else if (state == STATE_PLAYER_TWO_WINS) {
            $('#player2').addClass('winner');
            $('#player1').addClass('disabed');
            disableAllCells();
            $('#status').text('Player 2 wins!');
        }
    }

    function disableAllCells() {
        for (var i = 0; i < 9; i++) {
            $('#' + i).unbind('click');
        }
    }

    // set up the game board
    $('.cell').click(function() {
        var cellId = $(this).attr('id');
        sendExecuteMoverequest(cellId);
    });

    // add the URL for sharing
    $('#url').val(document.URL);
    $('#url').attr('size', document.URL.length)

    // send the join request
    socket.emit('join');
});
