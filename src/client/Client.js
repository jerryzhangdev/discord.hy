"use strict";

const request = require("request")
const WebSocket = require('ws');

const qdb = require("quick.db")
const tokendb = new qdb.table("discordhy")
let websocketdata;
var wss = new WebSocket('wss://gateway.discord.gg?v=6');


    
class Client {
	constructor(options = {}){
        this.websocketstat = options.websocketstat
        this.debug = options.debug
        if(this.websocketstat){
            if(typeof this.websocketstat !== 'boolean')throw new TypeError("option websocketstat must be boolean")
        }
        if(this.debug){
            if(typeof this.debug !== 'boolean')throw new TypeError("option debug must be boolean")
        }
	}

	async login(logintoken){
        this.token = logintoken
		
        if(!logintoken || logintoken === null)throw new TypeError("Login token not defined")
        var options = {
            'method': 'GET',
            'url': 'https://discordapp.com/api/users/@me',
            'headers': {
                'Authorization': `Bot ${logintoken}`,
                'Content-Type': 'application/json'
            }
            };
        
        request(options, (error, response) => { 
            if(JSON.parse(response.body).message === "401: Unauthorized")throw new Error("discord api error: invalid token");
        });
    
        wss.on('open', ws => {
          let data = {
          "op": 2,
          "d": {
            "token": logintoken,
            "properties": {
              "$os": "windows"
            }
          }
        }
        wss.send(JSON.stringify(data))
        if(this.websocketstat === true){
            console.log("Websocket Connection Established.")
        }
        })

        
        if(this.websocketstat === true){
            wss.on('close', ws => {
                console.log('WebSocket Connection Lost!')
            })
        }
        let seq;
        wss.on('message', data => {
            websocketdata = data
           seq = JSON.parse(data).s 
           if(this.debug === true){
            console.log(JSON.parse(data))
           }
        })


        setInterval(function(){
            let hbdata = {
                "op": 1,
                "d": seq
            }
            wss.send(JSON.stringify(hbdata))
        }, 45000)



        tokendb.set("token", { token: this.token })
        return this.token
	}


    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }   

    

    getToken(){
        return tokendb.get('token.token')
    }

    sendMessage(channel, content){
        if(!channel)throw new Error("Channel to send not defined!")
        //if(typeof channel !== 'number')throw new TypeError("Type of parameter channel must be a number")
        if(!content)throw new Error("Content to send not defined!")
        var options = {
          'method': 'POST',
          'url': `https://discordapp.com/api/channels/${channel}/messages`,
          'headers': {
            'Authorization': `Bot ${this.token}`,
            'content-type': 'application/json',
            'Cookie': '__cfduid=d691ce9608d2f2417dea1a984b9cb46aa1587146073; __cfruid=1c5bf67d2aa9e7bc76ced134a29a051b862dc121-1587146073'
          },
          body: JSON.stringify({"content": content})
        };
        request(options, function (error, response) { 
          if(JSON.parse(response.body).message === "Unknown Channel")throw new Error("Discord API error: I can't find the channel")
          if(JSON.parse(response.body).message === "401: Unauthorized")throw new Error("discord api error: you are not logged in");
        });


    }

    

    on(event, callback){
        if(!event)throw new Error("Required Value EVENT not inputted")
        if(!callback)throw new Error("required callback function is undefined")
        if(typeof callback !== "function")throw new TypeError("Callback function must be a function")


        //channelCreate
        if(event === "channelCreate"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "CHANNEL_CREATE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //channelDelete
        if(event === "channelDelete"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "CHANNEL_DELETE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //channelUpdate
        if(event === "channelUpdate"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "CHANNEL_UPDATE")return;
                return callback(JSON.parse(data).d)
            })
        }

        
        //channelPingUpdate
        if(event === "channelPingUpdate"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "CHANNEL_PINS_UPDATE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //debug
        if(event === "debug"){
            wss.on('message', function(data){
                return callback(JSON.parse(data))
            })
        }


        //guildCreate
        if(event === "guildCreate"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "GUILD_CREATE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //guildUpdate
        if(event === "guildUpdate"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "GUILD_UPDATE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //guildDelete
        if(event === "guildDelete"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "GUILD_DELETE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //guildBanAdd
        if(event === "guildBanAdd"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "GUILD_BAN_ADD")return;
                return callback(JSON.parse(data).d)
            })
        }


        //guildBanRemove
        if(event === "guildBanRemove"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "GUILD_BAN_REMOVE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //guildEmojisUpdate
        if(event === "guildEmojisUpdate"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "GUILD_EMOJIS_UPDATE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //guildIntegrationUpdate
        if(event === "guildIntegrationUpdate"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "GUILD_INTEGRATION_UPDATE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //guildMemberAdd
        if(event === "guildMemberAdd"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "GUILD_MEMBER_ADD")return;
                return callback(JSON.parse(data).d)
            })
        }


        //guildMemberRemove
        if(event === "guildMemberAdd"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "GUILD_MEMBER_REMOVE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //guildRolesCreate
        if(event === "guildRoleCreate"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "GUILD_ROLE_CREATE")return;
                return callback(JSON.parse(data).d)
            })
        }

        //guildRolesUpdate
        if(event === "guildRoleUpdate"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "GUILD_ROLE_UPDATE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //guildRolesDelete
        if(event === "guildRoleDelete"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "GUILD_ROLE_DELETE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //inviteCreate
        if(event === "inviteCreate"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "INVITE_CREATE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //inviteDelete
        if(event === "inviteDelete"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "INVITE_DELETE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //message
        if(event === "message"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "MESSAGE_CREATE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //messageUpdate
        if(event === "messageUpdate"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "MESSAGE_CREATE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //messageDelete
        if(event === "messageDelete"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "MESSAGE_DELETE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //messageDeleteBulk
        if(event === "messageDeleteBulk"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "MESSAGE_DELETE_BULK")return;
                return callback(JSON.parse(data).d)
            })
        }


        //messageReactionAdd
        if(event === "messageReactionAdd"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "MESSAGE_REACTION_ADD")return;
                return callback(JSON.parse(data).d)
            })
        }


        //messageReactionRemove
        if(event === "messageReactionRemove"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "MESSAGE_REACTION_REMOVE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //messageReactionRemoveAll
        if(event === "messageReactionRemoveAll"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "MESSAGE_REACTION_REMOVE_ALL")return;
                return callback(JSON.parse(data).d)
            })
        }

        //messageReactionRemoveEmoji
        if(event === "messageReactionRemoveEmoji"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "MESSAGE_REACTION_REMOVE_EMOJI")return;
                return callback(JSON.parse(data).d)
            })
        }


        //presenceUpdate
        if(event === "presenceUpdate"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "PRESENCE_UPDATE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //ready
        if(event === "ready"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "READY")return;
                return callback(JSON.parse(data).d)
            })
        }


        //typingStart
        if(event === "typingStart"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "TYPING_START")return;
                return callback(JSON.parse(data).d)
            })
        }


        //userUpdate
        if(event === "userUpdate"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "USER_UPDATE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //voiceStateUpdate
        if(event === "voiceStateUpdate"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "VOICE_STATE_UPDATE")return;
                return callback(JSON.parse(data).d)
            })
        }


        //voiceStateUpdate
        if(event === "voiceStateUpdate"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "VOICE_STATE_UPDATE")return;
                return callback(JSON.parse(data).d)
            })
        }
        


        //voiceStateUpdate
        if(event === "webhooksUpdate"){
            wss.on('message', function(data){
                if(JSON.parse(data).t !== "WEBHOOKS_UPDATE")return;
                return callback(JSON.parse(data).d)
            })
        }
    }


}

module.exports = Client;