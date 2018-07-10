# Stack
A multipurpose discord bot that helps you work more efficiently.

## Getting Started
The easiest way to get started with Stack is to deploy the bot to Heroku using the button below.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

1. Create a new app on the [discord developer website](https://discordapp.com/developers/applications/me). The name, description, and icon are all up to you! Scroll down to the bot section. Create a bot user and click to reveal the **Bot User Token** (not the client secret). Copy this token.
2. Invite the bot to your server by copying your Discord app's `client ID`. Go to the following URL after inserting your `Client ID`. [https://discordapp.com/api/oauth2/authorize?client_id=**REPLACE**&permissions=8&scope=bot](https://discordapp.com/api/oauth2/authorize?client_id=REPLACE&permissions=8&scope=bot)
3. After deploying on Heroku, navigate to your Dyno's settings. Click reveal config vars, and add a `password` var with the password you will want to use to access the admin panel. Also, add a `token` var with the value of the bot token we copied earlier.
4. Restart your Dyno (under the more menu) for good measure.
5. You should be able to run commands on your discord server. Try `s! help`.

If you are using the free plan, you will want to [verify your Heroku account](https://devcenter.heroku.com/articles/account-verification) and [make sure your Dyno never sleeps](https://stackoverflow.com/a/5482285/4383805).

From here, you can open the app by clicking the button in the heroku dashboard. Sign in using username `admin` and the password you set earlier. To get started writing custom commands, see the examples below.

## Examples

### Respond to Message
```javascript
msg.reply('Hello there!');
```

### Send a Direct Message to the Command Sender
```javascript
msg.author.send('Hello there!');
```

### Multiply Two Arguments
`s! command 2 5`
```javascript
var number = args[0] * args[1];

msg.reply('Your number is: ' + number);
```

### Return a cat picture/make an HTTP request
```javascript
var http = require('http');

http.get({
	host: 'aws.random.cat',
	port: 80,
	path: '/meow'
}, function(response) {
	response.on('data', function(data) {
		var link = JSON.parse(data)['file'];
		msg.reply(link);
	});
}).on('error', function(err) {
  msg.reply('An error occured!');
});
```

## Donate
If you'd like to support the future of Stack, please consider leaving a donation!

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=tstbest@gmail.com&lc=US&item_name=Stack+Bot+Donation&cn=&currency_code=USD&bn=PP-DonationsBF:btn_donateCC_LG.gif:NonHosted)
