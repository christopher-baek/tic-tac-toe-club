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
        $('#playerId').text(playerId);
    }

    /**
     * Executed when a move instruction is received from the server
     */
    function onExecuteMove(playerId, cellId) {
        $('#' + cellId).text(playerId);
        $('#' + cellId).unbind('click');
    }

    /**
     * Executed when a state change is received from the server
     */
    function onStateChange() {
        $('#state').text(state);
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
