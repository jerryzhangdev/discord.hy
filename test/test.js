let Discord = require("../src/index.js")// import library | npm i discord.hy
let client = new Discord.Client({ websocketstat: true, debug: false });//set up client with options

client.on("debug", function(msg){//call in the 'message' event//check the message content for !ping
    console.log(msg)
})
 

 
 
 
let login = client.login("Njg4NDI3MDg1NjE3NjkyOTYw.XpyT1A.AXZslxTasoi-jRGS1DQqvo2vOWg")