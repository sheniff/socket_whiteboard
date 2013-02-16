(function(){
	//Vars
	// var server = io.connect('http://warm-earth-1719.herokuapp.com'),
	var server = io.connect('http://localhost:7777'),
		// ToDo: Stupid Random User to be changed for something more serious xD
		user = Math.round(Math.random()*10000),
		foes = {};

	console.log('User ID: '+user);

	server.on('connect', function(data){
		console.log('SocketIO connected!', user);
		server.emit('join', user);
	});

	server.on('joined', function(data){
		console.log('Joined: ', data);
	});

	server.on('new_connection', function(user){
		console.log("New guy has connected:", user);
		// Sending that guy this user's info
		server.emit('reveal_to', user.id);
		createScreen(user);
	});

	server.on('user_disconnected', function(user){
		console.log(user.name + " has gone...");
		removeScreen(user);
	});

	server.on('board_update', function(data){
		CodeHeroWhiteBoard.update(foes['screen_'+data.sender.id+'_'+data.sender.name], data.changeObj);
	});

	server.on('server_messages', function(data){
		console.log('Server: ' + data.message);
	});

	server.on('revealed_user', function(user){
		console.log("Revealed user:", user);
		createScreen(user);
	});

	// Setting up sender form
	$(document).ready(function($) {
		var myEditor = CodeHeroWhiteBoard.create($('#whiteboard').get(0)),
				$screens = $('#friends_wb');

		window.selectMyTheme = function(){
			CodeHeroWhiteBoard.selectTheme(myEditor, $('selector#themeSelector').val());
		};

		createScreen = function(user){
			var id = 'screen_'+user.id+'_'+user.name;
			var $newScreen = $('<div id="'+id+'"><h2>Foe: '+user.name+'</h2><div class="screen"></div></div>').appendTo($screens);
			foes[id] = CodeHeroWhiteBoard.create($newScreen.find('div.screen').get(0));
		};

		removeScreen = function(user){
			var id = 'screen_'+user.id+'_'+user.name;
			$('#'+id).remove();
			delete foes[id];
		};

  	//Controlamos que el usuario cierra el chat, para enviar un mensaje al servidor de desconexión
  	$(window).on("beforeunload", function(e){
  		server.emit('disconnect');
  	});

		// Detecting changes
		myEditor.on("change", function(instance, changeObj){
			server.emit('board_change', changeObj);
		});
	});
}());
