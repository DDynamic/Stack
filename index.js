var auth = require('./auth');
var express = require('express')
var Twig = require('twig');
var http = require('http');
var fs = require('fs');

var app = express()

try {
    var config = require('./config.json');
} catch (e) {
	var config = {};
}

var port = process.env.PORT || 8080;

app.set('view engine', 'twig');
app.settings.views = 'views';

app.use(auth);

var commands = [];

fs.readdirSync('./commands').forEach(file => {
	commands.push(require('./commands/' + file));
});

app.get('/', function (req, res) {
	res.render('index.twig');
});

app.get('/commands', function (req, res) {
	res.render('commands.twig', {
		commands: commands
	});
});

app.get('/command/:command', function (req, res) {
	if (req.params.command != 'new') {
		res.render('command.twig', {
			command: commands[req.params.command]
		});
	} else {
		res.render('command.twig', {
			command: 'new'
		});
	}
});

app.listen(port, function() {
    console.log('Stack is running on port ' + port
		+ '\n' + 'Username: ' + (process.env.username || 'admin')
		+ '\n' + 'Password: ' + (process.env.password || 'admin'));
});

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    client.user.setPresence({
        game: {
            name: 's! help | github.com/DDynamic/Stack'
        }
    });
});

client.on('message', msg => {
	if (msg.content.startsWith('s!')) {
		var content = msg.content.split(' ');
		var command = content[1];
		var args = content.slice(2);
		
		for (i = 0; i < commands.length; i++) {
			var prefixes = commands[i].prefix;
			
			if (prefixes.includes(command)) {
				try {
					commands[i].process(client, msg, args);
				} catch(err) {
					console.error(err);
					msg.reply('an error occured when executing that command.');
				}
			}
		}
	}
});

process.on('unhandledRejection', (reason) => {
    console.error(reason.toString());
});

client.login((config.token || process.env.token));