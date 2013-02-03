// Dependencies
var express = require('express'),
		path = require('path'),
		app = express(),
		http = require('http'),
		server = http.createServer(app),
		io = require('socket.io').listen(server),
		port = process.env.PORT || 7777;

function clean_message(message){
	var i,
		result,
		ret = "";
	for (var i in message){
		switch (message[i]) {
			case "<":
				result = "&lt;";
				break;
			case "<":
				result = "&gt;";
				break;
			case "&":
				result = "&amp;";
				break;
			default:
				result = message[i];
				break;
		}
		ret += result;
	}
	return ret;
};

// Socket.IO connection
io.sockets.on('connection', function(socket){
	socket.emit('server_messages', 'Connecting to chat...');

	socket.on('join', function(name){
		name = clean_message(""+name);

		socket.set('user', name);
		socket.emit('joined', {
			message: 'Connected as '+name
		});
		socket.broadcast.emit('new_connection', name);
	});

	socket.on('disconnect', function(){
		socket.get('user', function(err, name){
			socket.broadcast.emit('server_messages', {
				message: name+" has gone..."
			});
		});
	});

	socket.on('board_change', function(data){
		socket.get('user', function(err, name){
			socket.broadcast.emit('board_update', {sender: name, changeObj: data});
		});
	});
});

// Configuring express (Middleware)
app.configure(function () {
	app.use(app.router);
	app.use(express.static(path.join(__dirname, "static")));
});

// URLs and callbacks
app.get('/', function(request, response) {
	response.sendfile(path.join(__dirname, "index.html"));
});

server.listen(port);
console.log('Listening to port ' + port + '...');
