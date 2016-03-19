module.exports = function(game) {
	var express = require('express');
	var router = express.Router();

	/* GET home page. */
	router.get('/', function(req, res, next) {
		game.hello();
	  res.render('index', { title: 'Express' });
	});

	return router;
}
