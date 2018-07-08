var exports = module.exports = {};

var commands = [
	require('./channel.js'),
	require('./help.js')
];

exports.prefix = ['help', 'info', 'h'];
exports.help = `
**s! help** Returns bot information.
**s! help [command]** Returns help for the specified command.
`;

exports.process = function(client, msg, args) {
    msg.delete();
    
    var custom = true;
    
    if (typeof args[0] === 'undefined') {
        msg.author.send('**Stack Bot** | info: <https://github.com/DDynamic/Stack> | admin: <' + env['url'] + '> | For command help, type `s! help [command]`');
    } else {
        var command = args[0];

        for (var i = 0; i < commands.length; i++) {
            var prefixes = commands[i].prefix;
            
            if (prefixes.includes(command)) {
                msg.author.send(commands[i].help);
            }
        }
    }
}