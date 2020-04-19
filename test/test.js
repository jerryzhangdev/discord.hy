let Discord = require("../src/index.js")// import library | npm i discord.hy
let client = new Discord.Client({ websocketstat: true });//set up client with options
 
 
client.on("message", function(msg){//call in the 'message' event
    if(msg.content.startsWith("!ping")){//check the message content for !ping
        client.sendMessage(msg.channel_id, "Ping!")//send response
    }
})
 
 
client.on("ready", function(data){//call in the 'ready' event
    console.log(data)//log the ready data in the console
})
 
 
 
let login = client.login("Njg4NDI3MDg1NjE3NjkyOTYw.XpvjJQ.eXY61_tgnkJyHvy3KoYKSP6myD0")