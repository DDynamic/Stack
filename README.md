# Stack
A multipurpose discord bot that helps you work more efficiently.

## Getting Started
The easiest way to get started with Stack is to deploy the bot to Heroku using the button below.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

1. Deploy the app to heroku using the button above. If you are using the free plan, you will want to [verify your Heroku account](https://devcenter.heroku.com/articles/account-verification).
2. Create a new app with a bot user on the [discord developer website](https://discordapp.com/developers/applications/me). Copy the **bot user's token**.
3. Invite the bot to your server. Go to the following URL after replacing the `Client ID`. [https://discordapp.com/api/oauth2/authorize?client_id=**REPLACE**&permissions=8&scope=bot](https://discordapp.com/api/oauth2/authorize?client_id=CLIENTID&permissions=8&scope=bot)
4. Go to your app's `Config vars` and add in a `TOKEN` key with the value of your bot user's token. Under Resources, disable the web dyno and enable the worker dyno.
6. Run `s! help` on your server.

To add/edit commands, use [Medis](https://github.com/luin/medis) to login to Heroku Redis. You can find the credientials on the Heroku Redis add-on page in your Dyno's dashboard.
You can use the [command writer](https://ddynamic.github.io/Stack/helper.html) to easily write and format commands.

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