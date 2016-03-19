module.exports = function(game) {
  var express = require('express');
  var router = express.Router();

  // Generate a new game ID and bounce the user to that game
  router.get('/', function(request, response) {
  	var gameId = game.startNewGame();
    response.redirect('/' + gameId);
  });

  // Handle users in a game
  router.get('/:gameId', function(request, response) {
  	response.render('index', { title: 'Express' });
  });

  return router;
}
