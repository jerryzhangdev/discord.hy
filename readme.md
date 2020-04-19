# DISCORD.HY

<br>

### Welcome to Discord.hy, developed by Hydrogen Studio.

<br>

## Info


Documentation: [https://hydrogenapi.gitbook.io/discordhy/](https://hydrogenapi.gitbook.io/discordhy/)


Discord: [Support Server](https://discord.gg/97WZQ9p)


## About

Discord.hy is a modern discord custom bot making library. We currently only support sending messages, but more are coming everyday!

Our goal is to reached 100% api coverage at the end of 2020.


## Install

```npm i discord.hy```

## Basic Bot Example

```js
let Discord = require("discord.hy")// import library | npm i discord.hy
let client = new Discord.Client({ websocketstat: true });//set up client with options


client.on("message", function(msg){//call in the 'message' event
	if(msg.content.startsWith("!ping")){//check the message content for !ping
		client.sendMessage(msg.channel_id, "Ping!")//send response
	}
})


client.on("ready", function(data){//call in the 'ready' event
	console.log(data)//log the ready data in the console
})



let login = client.login("super secret bot token")
```



# More

More are coming, and we aim to beat 100% coverage before 2021.