const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');
const request = require('request');

var Redis = require('ioredis');
var redis = new Redis(process.env.REDIS_URL);

redis.hsetnx('commands', 'channel', fs.readFileSync(__dirname + '/commands/channel.txt'));
redis.hsetnx('commands', 'help', fs.readFileSync(__dirname + '/commands/help.txt'));

client.on('ready', () => {
	client.user.setPresence({
        game: {
            name: (process.env.PREFIX || 's!') + ' help | github.com/DDynamic/Stack'
        }
    });
	
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	if (msg.content.startsWith((process.env.PREFIX || 's!') + ' ')) {
		var content = msg.content.split(' ');
		var invoke = content[1];
		var args = content.slice(2);
		
		redis.hgetall('commands', function (err, result) {
			for (var index in result) {				
				if (index == invoke) {
					eval('try {' + result[index] + '} catch(e) { console.log(e); msg.reply("an error occurred when executing that command. Check the console for more information."); }');
				}
			}
		});
	}
});

process.on('unhandledRejection', (reason) => {
    console.error(reason.toString());
});

client.login(process.env.TOKEN);