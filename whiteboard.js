// Dependencies
var express = require('express'),
		path = require('path'),
		app = express(),
		port = process.env.PORT || 7777;


// Configuring express (Middleware)
app.configure(function () {
	app.use(app.router);
	app.use(express.static(path.join(__dirname, "static")));
});

// URLs and callbacks
app.get('/', function(request, response) {
	response.sendfile(path.join(__dirname, "index.html"));
});

app.listen(port);
console.log('Listening to port ' + port + '...');
