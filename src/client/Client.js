"use strict";

const request = require("request")
const WebSocket = require('ws');
const Channel = require("./actions/channelManager.js")
const User = require("./actions/userManager.js")
const Guild = require("./actions/guildManager.js")
const qdb = require("quick.db")
const tokendb = new qdb.table("discordhytoken")
const db = new qdb.table("discordhydb")
let websocketdata;
var wss = new WebSocket('wss://gateway.discord.gg?v=6');
const { DiscordAPI, TypeErrors, KeyMissingError, httpErrors } = require("../Error/Errors.js")

const fetch = require("node-fetch")
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

class Client {
	constructor(options = {}){
        this.websocketstat = options.websocketstat
        this.debug = options.debug
        this.reconnect = options.reconnect
        if(this.websocketstat){
            if(typeof this.websocketstat !== 'boolean')throw new TypeError(TypeErrors.BOOLEAN)
        }
        if(this.debug){
            if(typeof this.debug !== 'boolean')throw new TypeError(TypeErrors.BOOLEAN)
        }
        if(this.reconnect){
            if(typeof this.reconnect !== 'boolean')throw new TypeError(TypeErrors.BOOLEAN)
        }
        if(!this.reconnect){
            this.reconnect === false
        }
	}

	async login(logintoken){
        this.token = logintoken
		
        if(!logintoken || logintoken === "")throw new Error(DiscordAPI.NO_TOKEN)
        if(typeof logintoken !== "string")throw new TypeError(TypeErrors.STRING)
        var options = {
            'method': 'GET',
            'url': 'https://discordapp.com/api/users/@me',
            'headers': {
                'Authorization': `Bot ${logintoken}`,
                'Content-Type': 'application/json'
            }
            };
        
        request(options, (error, response) => { 
            if(JSON.parse(response.body).message === "401: Unauthorized")throw new Error(DiscordAPI.INVALID_TOKEN);
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

        if(this.reconnect === true){
            wss.on('close', ws => {
                console.log('Websocket connection lost...Reconecting')
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
                console.log("Reconnected")
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
        }, 41250)



        tokendb.set("token", { token: this.token, messsage: "Hey! You are smart to figure out how to get here! But don't change the token here as it will mess your bot up." })
        return this.token
	}




    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    } 


    async getChannel(id){

            var options = {
  'method': 'GET',
  'headers': {
    'Authorization': `Bot ${tokendb.get("token.token")}`,
    'Cookie': '__cfduid=d62bef48329670a370c27df97f1a81eba1587580440; __cfruid=bf4b45e1a6e5ef27d99bc35b0eab7581881c3b8c-1587580440'
  }
};
    let req = await fetch(`https://discordapp.com/api/channels/${id}`, options)
    let data = await req.json()
    this.datas = {
  channel_id: data.id,
  last_message_id: data.last_message_id,
  type: data.type,
  name: data.name,
  position: data.position,
  parent_id: data.parent_id,
  topic: data.topic,
  guild_id: data.guild_id,
  permission_overwrites: data.permission_overwrites,
  nsfw: data.nsfw,
  rate_limit_per_user: data.rate_limit_per_user,
  bot: true
}
    return new Channel(this.datas)
    } 

    getToken(){
        return tokendb.get('token.token')
    }

    

    

    on(event, callback){
        if(!event)KeyMissingError("event")
        if(!callback)KeyMissingError("callback")
        if(typeof callback !== "function")throw new TypeError(TypeErrors.FUNCTION)


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
            wss.on('message', async function(data){
                if(JSON.parse(data).t !== "MESSAGE_CREATE")return;
                this.channel = new Channel(JSON.parse(data).d);
                this.author = new User(JSON.parse(data).d.author)
                
                this.data = JSON.parse(data).d

                    let resp = await fetch(`https://discordapp.com/api/guilds/${JSON.parse(data).d.guild_id}`, {
                        method: 'get',
                        headers: {
                            "Authorization": `Bot ${tokendb.get("token.token")}`
                        }
                    })

                let guildData = await resp.json()

                this.guild = new Guild(JSON.stringify(guildData))
                return callback(this)
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