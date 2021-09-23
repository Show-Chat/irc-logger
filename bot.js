module.exports = function( logs ) {
	var env = process.env;

	console.log( 'server: ' + env.IRC_SERVER );
	console.log( 'nick: ' + env.IRC_BOT_NICK );
	console.log( 'channels: ' + env.IRC_CHANNELS );
	console.log( 'username: ' + env.IRC_BOT_USERNAME );
	console.log( 'realname: ' + env.IRC_BOT_REALNAME );
	console.log( 'password: ' + env.IRC_BOT_PASSWORD );

	// start the irc bot, and for each message on each channel, append to the logs
	if( env.IRC_SERVER && env.IRC_BOT_NICK && env.IRC_CHANNELS ) {
		var irc = require('irc'),
			channels = env.IRC_CHANNELS.toLowerCase().split(',');

		console.log( 'connecting to IRC!' );

		var client = new irc.Client(
			env.IRC_SERVER,
			env.IRC_BOT_NICK,
			{
				userName: env.IRC_BOT_USERNAME || 'showchat',
				userName: env.IRC_BOT_REALNAME || 'www.showchat.tk',
				password: env.IRC_BOT_PASSWORD || null,
				channels: channels,
				stripColors: true
			}
		);

		for( var c in channels ) {
			logs[ channels[c] ] = [];
		}

		client.addListener('message', function (from, to, message) {
			to = to.toLowerCase();
			if( env.NODE_ENV == 'development' ) console.log( 'message from ' + from + ' on ' + to + ': ' + message );
			if( logs[ to ] instanceof Array ) {
				logs[ to ].push({ from: from, message: message, stamp: (new Date).getTime() });
				if( logs[ to ].length > 10000 ) logs[ to ] = logs[ to ].slice( -10000 );
			}
		});


	} else {
		console.log( 'NOT STARTING IRC BOT!!!!' );
		console.log( 'You are missing some environment vars dummy.' );
	}

}
