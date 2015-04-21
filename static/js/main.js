$(function (){
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
		alert('Nowe urządzenie \''+data.name+ '\'.');
		console.log('Nowe urządzenie \''+data.name+ '\'.');
		location.href = location.href; // przeladuj stronke
	});
	socket.on('readd', function (data) {
		console.log('Reconnect urządzenia \''+data.name+ '\'.');
	});	
});