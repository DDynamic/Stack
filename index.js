const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();

const fs = require('fs');
const request = require('request');

const { Client } = require('pg');

const database = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

database.connect();

database.query(`
	CREATE TABLE IF NOT EXISTS app_command (id serial PRIMARY KEY, aliases VARCHAR(100), help VARCHAR(1000), function VARCHAR(100000));
	CREATE TABLE IF NOT EXISTS app_listener (id serial PRIMARY KEY, channel VARCHAR(100), function VARCHAR(100000));
`);

database.query(`
	INSERT INTO app_command (aliases, help, function) SELECT 'channel', $1::text, $2::text WHERE NOT EXISTS (SELECT aliases FROM app_command WHERE aliases = 'channel');
`, ['```\nchannel export {destination} - Exports the history of the current channel to the specified destination.\nchannel scrub [messages] - Deletes the amount of specified messages. If no number is specified, then the last 100 messages will be deleted.\nchannel private - Prevents @everyone from viewing the channel.\nchannel reset - Completely resets a channel\'s permissions.\nchannel invite {user1} [user2] [user3] - Enables read access on the current channel for the specified user(s).\nchannel remove {user1} [user2] [user3] - Deletes the amount of specified messages.\nchannel list [displaynames|ids] - Lists the specified values that are present in the channel.\n```', fs.readFileSync(__dirname + '/commands/channel.txt')]);

database.query(`
	INSERT INTO app_command (aliases, help, function) SELECT 'help', $1::text, $2::text WHERE NOT EXISTS (SELECT aliases FROM app_command WHERE aliases = 'help');
`, ['Runs the help command.', fs.readFileSync(__dirname + '/commands/help.txt')]);

database.query(`
	INSERT INTO app_command (aliases, help, function) SELECT 'message', $1::text, $2::text WHERE NOT EXISTS (SELECT aliases FROM app_command WHERE aliases = 'message');
`, ['Sends a message to everyone with the first argument, role name.', fs.readFileSync(__dirname + '/commands/message.txt')]);

database.query(`
	INSERT INTO app_listener (channel, function) SELECT 'general', $1::text WHERE NOT EXISTS (SELECT channel FROM app_listener WHERE channel = 'general');
`, [fs.readFileSync(__dirname + '/listeners/general.txt')]);

client.on('ready', () => {
	client.user.setPresence({
        game: {
            name: (process.env.PREFIX || 's!') + ' help | github.com/DDynamic/Stack'
        }
    });

	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	if (msg.content.toLowerCase().startsWith(process.env.PREFIX.toLowerCase() || 's!')) {
        if (msg.guild) {
            var content = msg.content.split(process.env.PREFIX.toLowerCase() || 's!')[1].trim().split(' ');
            var invoke = content[0].toLowerCase();
            var args = content.slice(1);

			database.query('SELECT * FROM app_command', (err, res) => {
				var found = false;
				var commands = res.rows;

				for (command in commands) {
					var command = commands[command];
					var aliases = command['aliases'].split(', ');

					for (alias in aliases) {
						if (aliases[alias] == invoke) {
							found = true;

							try {
								eval(command['function']);
							} catch (err) {
								console.log(err);
								msg.reply('an error occured when executing that command. Check the console for more information.');
							}
						}
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

    if (msg.guild) {
		database.query('SELECT * FROM app_listener', (err, res) => {
			var found = false;
			var listeners = res.rows;

			for (listener in listeners) {
				var listener = listeners[listener];

				if (listener['channel'] == msg.channel.name) {
					try {
						eval(listener['function']);
					} catch (err) {
						console.log(err);
						msg.reply('an error occured when executing a listener. Check the console for more information.');
					}
				}
			}
		});
    }
});

process.on('unhandledRejection', (reason) => {
    console.error(reason.toString());
});

client.login(process.env.TOKEN);
