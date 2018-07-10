const bodyParser = require('body-parser');
const Twig = require('twig');
const Express = require('express');
const fs = require('fs');
const Tmp = require('tmp');

var auth = require('./auth');
var flash = require('express-flash-2');

try {
    var config = require('./config.json');
} catch (e) {
	var config = {};
}

var port = process.env.PORT || 8080;

var app = Express();

app.set('view engine', 'twig');
app.settings.views = 'views';

app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(auth);

function commands() {
	var commands = [];

	fs.readdirSync('./commands').forEach(file => {
		commands.push(JSON.parse(fs.readFileSync('./commands/' + file)));
	});
	
	return commands;
}

app.get('/', function (req, res) {
	res.render('index.twig');
});

app.get('/commands', function (req, res) {
	res.render('commands.twig', {
		commands: commands(),
		msg: req.query.msg
	});
});

app.get('/commands/delete/:command', function(req, res) {
	fs.unlinkSync('./commands/' + commands()[req.params.command].prefixes[0] + '.json');
	res.redirect('/commands?msg=Command deleted.');
});

app.get('/command/:command', function (req, res) {
	res.render('command.twig', {
		command: commands()[req.params.command],
		msg: req.query.msg
	});
});

app.post('/command', function (req, res) {
	if (req.body.prefixes.length < 1) {
		return res.redirect('/command/new?msg=You must specify at least one prefix separated by commas.');
	}
	
	var prefixes = req.body.prefixes.split(', ');
	var help = req.body.help;
	var code = req.body.code.split('\n');
	
	var file = JSON.stringify({
		prefixes: prefixes,
		help: help,
		code: code
	}, null, 4);
	
	fs.writeFileSync('./commands/' + prefixes[0] + '.json', file);
	res.redirect('/commands');
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
		var invoke = content[1];
		var args = content.slice(2);
	
		
		for (command of commands()) {
			var prefixes = command.prefixes;
			var process = new Function('client', 'msg', 'args', command.code.join('\n'));
			
			if (prefixes.includes(invoke)) {
				try {
					process(client, msg, args);
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