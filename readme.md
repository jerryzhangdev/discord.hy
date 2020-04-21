# DISCORD.HY

### Welcome to Discord.hy, the most **modern** discord bot making library, developed by Hydrogen Studio.

<br>

<a href="https://nodei.co/npm/discord.hy/"><img src="https://nodei.co/npm/discord.hy.png"></a>
<a href="https://discord.gg/97WZQ9p"><img alt="Discord" src="https://discordapp.com/api/guilds/639122730389864458/embed.png"></img></a>
<br>

# Table of Content
<a href="#">Discord.hy</a><br>
<a href="#info">Info</a><br>
<a href="#about">About</a><br>
<a href="#table-of-content">Table of Content</a><br>
<a href="#install">Install</a><br>
<a href="#basic-bot-example">Basic Bot Example</a><br>

## Info


Documentation: [https://discordhy.js.org](https://discordhy.js.org)


Discord: New server coming soon

## Stats
<br>
<img alt="npm" src="https://img.shields.io/npm/v/discord.hy">
<img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/discord.hy?label=discord.hy%20file%20size&style=plastic">
<img alt="NPM" src="https://img.shields.io/npm/l/discord.hy">

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
        let Embed = new Discord.RichEmbed()
           .setTitle("Ping Command Response")
           .addField("Ping", "Pong", true)
           .addField("Ping", "Pong")//inline default to false
           .setTimestamp()
           .setColor("RANDOM");
        msg.channel.sendEmbed(Embed)//send Embed response
    }
})
 
 
client.on("ready", function(data){//call in the 'ready' event
    console.log(data)//log the ready data in the console
})
 
 
 
let login = client.login("super secret bot token")
```



# More

More are coming, and we aim to beat 100% coverage before 2021.
