const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	if (msg.content.startsWith(process.env.prefix || 's!')) {
		msg.reply('ping!');
	}
});

client.login(process.env.token);