let Discord = require("../src/index.js")// import library | npm i discord.hy
let client = new Discord.Client({ websocketstat: true, debug: false, reconnect: true });//set up client with options


client.on('ready', data => {
    client.setPresence("Testing", 0, 'online', false)
})

client.on("message", msg => {
    if(msg.author.bot)return
    msg.channel.sendMessage(msg.timestamp)
})
 
client.login("")