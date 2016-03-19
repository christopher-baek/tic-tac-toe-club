$(function() {
	var game = new Game(
		$('#gameId').val(), 
		$('#playerId').val());

	$('.cell').click(function() {
		game.makeMove($(this).attr('id'));
	});

	$('#url').val(document.URL);
	$('#url').attr('size', document.URL.length)


	thisGame.test();
});