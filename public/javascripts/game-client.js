(function() {
	var socket = io();

	$('.board').click(function() {
		alert($(this).attr('id'));
	});
})();
