const Discord = require('discord.js');
const client = new Discord.Client();

var Redis = require('ioredis');
var redis = new Redis(process.env.REDIS_URL);

redis.hsetnx('commands', '1', JSON.stringify(require('./commands/help.json')));
redis.hsetnx('commands', '2', JSON.stringify(require('./commands/channel.json')));

client.on('ready', () => {
	client.user.setPresence({
        game: {
            name: 's! help | github.com/DDynamic/Stack'
        }
    });
	
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	if (msg.content.startsWith(process.env.PREFIX || 's!')) {
		var content = msg.content.split(' ');
		var invoke = content[1];
		var args = content.slice(2);
		
		redis.hgetall('commands', function (err, result) {
			for (var index in result) {
				var command = JSON.parse(result[index]);
				var prefixes = command.prefixes;
				
				if (prefixes.includes(invoke)) {
					eval(command.code.join('\n'));
				}
			}
		});
	}
});

process.on('unhandledRejection', (reason) => {
    console.error(reason.toString());
});

client.login(process.env.TOKEN);