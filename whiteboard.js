// Dependencies
var express = require('express'),
		path = require('path'),
		app = express(),
		http = require('http'),
		server = http.createServer(app),
		io = require('socket.io').listen(server),
		port = process.env.PORT || 7777,
		sockets = [];

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

	var userId = sockets.push(socket);

	socket.on('join', function(name){
		name = clean_message(''+name);

		socket.set('user', name);
		socket.emit('joined', {
			message: 'Connected as '+name
		});

		socket.broadcast.emit('new_connection', {name: name, id: userId});
	});

	socket.on('disconnect', function(){
		socket.get('user', function(err, name){
			socket.broadcast.emit('user_disconnected', {name: name, id: userId});
		});
	});

	socket.on('board_change', function(data){
		socket.get('user', function(err, name){
			socket.broadcast.emit('board_update', {sender: {name: name, id: userId}, changeObj: data});
		});
	});

	socket.on('reveal_to', function(socketId){
		var askingSocket = io.sockets.sockets[socketId];
		if(askingSocket)
			socket.get('user', function(err, name){
				askingSocket.emit('revealed_user', {name: name, id: userId});
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
