module.exports = function(gameServer) {

    var express = require('express');
    var router = express.Router();

    // Generate a new game ID and bounce the user to that game
    router.get('/', function(request, response) {
        var gameId = gameServer.newGame();
        response.redirect('/' + gameId);
    });

    // Connect users to a game
    router.get('/:gameId', function(request, response) {
        var gameId = request.params.gameId;

        if (gameServer.containsGame(gameId)) {
            response.render('index', {
                title: 'Express',
                gameId: gameId
            });
        } else {
            response.redirect('/');
        }
    });

    return router;
    
}
