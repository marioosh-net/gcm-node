$(function (){
	var modal = function(text) {
		$('#modal-event-body').text(text);
		$('#modal-event').modal('show');		
	};
	$('#modal-event').on('hidden.bs.modal', function (e) {
		location.href = location.href; // przeladuj stronke
	})			

	/**
	 * socket.io
	 */
	// var socket = io.connect("http://" + window.location.host);
	var socket = null;
	if(ioSocketUrl != null && ioSocketUrl != 'null') {
		socket = io.connect(ioSocketUrl);	
	} else {
		socket = io.connect();//auto-discovery	
	}
	socket.on('add', function (data) {
		modal('Nowe urządzenie \''+data.name+ '\'.');
		console.log('Nowe urządzenie \''+data.name+ '\'.');
	});
	socket.on('readd', function (data) {
		console.log('Reconnect urządzenia \''+data.name+ '\'.');
	});	
});