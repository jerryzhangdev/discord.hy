let Discord = require("../src/index.js")// import library | npm i discord.hy
let client = new Discord.Client({ websocketstat: true, debug: false });//set up client with options

client.on("ready", (data) => {
    
})
 
client.on("message", msg => {
    console.log(msg)
})
 
client.login("Njg4NDI3MDg1NjE3NjkyOTYw.XqWtXg.AKkzd1WtCDSFaV7Nr7z2MzuAHD0")