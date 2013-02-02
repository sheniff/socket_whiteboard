(function(){
	//Vars
	var server = io.connect('http://warm-earth-1719.herokuapp.com'),
		// server = io.connect('http://localhost:7777'),
		// ToDo: Stupid Random User to be changed for something more serious xD
		user = Math.round(Math.random()*10000);

	console.log('User ID: '+user);

	server.on('connect', function(data){
		console.log('SocketIO connected!', user);
		server.emit('join', user);
	});

	server.on('joined', function(data){
		console.log('Joined: '+data.message);
	});

	server.on('new_connection', function(name){
		console.log("New guy has connected: "+name);
	});

	server.on('board_update', function(data){
		updateEditor(data.changeObj);
	});

	server.on('server_messages', function(data){
		console.log('Server: ' + data.message);
	});

	// Setting up sender form
	$(document).ready(function($) {
  	//Controlamos que el usuario cierra el chat, para enviar un mensaje al servidor de desconexión
  	$(window).on("beforeunload", function(e){
  		server.emit('disconnect');
  	});

		// Detecting changes
		editor.on("change", function(instance, changeObj){
			server.emit('board_change', changeObj);
		});
	});
}());
