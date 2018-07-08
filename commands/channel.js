var exports = module.exports = {};

exports.prefix = ['channel', 'ch', 'c'];
exports.help = `
**s! channel scrub {amount-to-delete}** Deletes the last messages from the channel. Default and max is 100.
**s! channel prviate** Denies @everyone the ability to view the channel.
**s! channel reset** Removes any channel specific permissions.
**s! channel invite {user1} [user2] [etc]** Allows the specified user(s) to view the channel. 
**s! channel remove {user1} [user2] [etc]** Prevents the specified user(s) from viewing the channel.
`;

exports.process = function(client, msg, args) {
    msg.delete();
    
    var access = false;
    
    if (msg.member) {
        msg.member.hasPermission('MANAGE_CHANNELS') ? access = true: access = false; 
    } else if(msg.author.bot) {
        access = true;
    }
    
    if (access) {
        switch(args[0]) {
            case 'scrub':
                if (args[1] && args[1] <= 100) {
                    msg.channel.bulkDelete(args[1], true);
                } else {
                    msg.channel.bulkDelete(100, true);
                }
    
                break;
            case 'private':
                msg.channel.overwritePermissions(msg.channel.guild.defaultRole.id, {
                    READ_MESSAGES: false
                });
                msg.channel.permissionOverwrites.deleteAll();
                msg.channel.send({embed: {
                    color: 14277081,
                    title: 'Privatized',
                    description: 'This channel has been privatized. Overridden permissions have remained intact. **@everyone cannot view this channel.** \n\n Run `s! channel reset` if you would like to reset channel permissions entirely.'
                  }
                });
                break;
            case 'reset':
                msg.channel.permissionOverwrites.deleteAll();
                msg.channel.send({embed: {
                    color: 14277081,
                    title: 'Reset',
                    description: 'This channel\'s permissions have been reset. **Anyone can access this channel.** \n\n Run `s! channel private` if you would like to make this channel exclusive.'
                     }
                });
                break;
            case 'invite':
                args.shift();
                var invitations = '';
    
                var i;
                for (i = 0; i < args.length; i++) {
                    var query = args[i];
    
                    client.users.find(function(user) {
                        var username = user.username.toUpperCase();
    
                        if (username.includes(query.toUpperCase())) {
                            msg.channel.overwritePermissions(user, {
                                READ_MESSAGES: true
                            });
                            invitations += '<@' + user.id + '> ';
                        }
                    });
                }
    
                if (!invitations) {
                    invitations = 'No users were invited.';
                } else {
                    invitations = invitations + 'joined.';
                }
    
                msg.channel.send({embed: {
                    color: 14277081,
                    title: 'Joined',
                    description: invitations
                  }
                });
    
                break;
            case 'remove':
                args.shift();
                var removals = '';
    
                for (i = 0; i < args.length; i++) {
                    var query = args[i];
    
                    client.users.find(function(user) {
                        var username = user.username.toUpperCase();
    
                        if (username.includes(query.toUpperCase())) {
                            msg.channel.permissionOverwrites.get(user.id).delete();
                            removals += '<@' + user.id + '> ';
                        }
                    });
                }
    
                if (!removals) {
                    removals = 'No users were removed.';
                } else {
                    removals = removals + 'left.';
                }
    
                msg.channel.send({embed: {
                    color: 14277081,
                    title: 'Left',
                    description: removals
                  }
                });
                break;
            default:
                msg.reply('invalid subcommand! Please refer to the documentation.');
        }   
    } else {
        msg.reply('you must have the **Manage Channels** permission to run this command.');
    }
}