const Twig = require('twig');

var express = require('express')
var app = express()

app.set('view engine', 'twig');
app.settings.views = 'views';

app.get('/', function (req, res) {
	res.render('index.twig', {
		message : "Hello World"
	  });
})

app.listen(8080, function() {
    console.log('Our app is running on http://localhost:' + 8080);
});