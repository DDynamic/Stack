const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');
const request = require('request');

var Redis = require('ioredis');
var redis = new Redis(process.env.REDIS_URL);

redis.hsetnx('commands', 'help', fs.readFileSync(__dirname + '/commands/help.txt'));
redis.hsetnx('commands', 'channel', fs.readFileSync(__dirname + '/commands/channel.txt'));
redis.hsetnx('commands', 'message', fs.readFileSync(__dirname + '/commands/message.txt'));

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
        if (msg.guild) {
            var content = msg.content.split(' ');
            var invoke = content[1];
            var args = content.slice(2);
            
            redis.hgetall('commands', function (err, result) {
                var found = false;
                
                for (var index in result) {				
                    if (index == invoke) {
                        found = true;
                        eval('try {' + result[index] + '} catch(e) { console.log(e); msg.reply("an error occurred when executing that command. Check the console for more information."); }');
                    }
                }
                
                if (!found) {
                    msg.reply('that command does not exist. Refer to command help by running: `'+ (process.env.PREFIX || 's!') + ' help`');
                }
            });
        } else {
            msg.author.send('Commands can only be run in a channel on the discord server.');
        }
	}
});

process.on('unhandledRejection', (reason) => {
    console.error(reason.toString());
});

client.login(process.env.TOKEN);