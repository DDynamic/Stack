const Twig = require('twig');

const auth = require('./auth');

var express = require('express')
var app = express()

var port = process.env.PORT || 8080;

app.set('view engine', 'twig');
app.settings.views = 'views';

app.use(auth);

app.get('/', function (req, res) {
	res.render('index.twig', {
		message : "Hello World"
	});
})

app.listen(port, function() {
    console.log('Stack is running on http://localhost:' + port
		+ '\n' + 'Username: ' + process.env.username
		+ '\n' + 'Password: ' + (process.env.password || 'password'));
});