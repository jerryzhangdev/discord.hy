"use strict";

const request = require("request")
const WebSocket = require('ws');
const Channel = require("./actions/channelManager.js")
const User = require("./actions/userManager.js")
const Guild = require("./actions/guildManager.js")
const qdb = require("quick.db")
const tokendb = new qdb.table("discordhytoken")
const db = new qdb.table("discordhydb")
const GuildCollection = require("./Collection/GuildCollection.js")
let websocketdata;
const { Errors, KeyMissingError } = require("../Error/Errors.js")






const fetch = require("node-fetch")
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
let wss = new WebSocket('wss://gateway.discord.gg?v=6');
class Client {
	constructor(options = {}){
        this.websocketstat = options.websocketstat
        this.debug = options.debug
        this.reconnect = options.reconnect
        this.usersid = []
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
        this.wssurl = 'wss://gateway.discord.gg?v=6';
        this._patch()
	}

	async login(logintoken){
        this.token = logintoken
		
        if(!logintoken || logintoken === "")throw new Error(Errors.NO_TOKEN)
        if(typeof logintoken !== "string")throw new TypeError(Errors.STRING)
    
        wss.on('open', ws => {
          let data = {
          "op": 2,
          "d": {
            "token": logintoken,
            "properties": {
              "$os": "linux"
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
                let closemessage;
                if(ws === 4000){
                    closemessage = "4000 Unknown Error"
                }else if(ws === 4001){
                    closemessage = "4001 Unknown Opcode"
                }else if(ws === 4002){
                    closemessage = "4002 Decode Error"
                }else if(ws === 4003){
                    closemessage = "4003 Not Authenticated"
                }else if(ws === 4004){
                    closemessage = "4004 Invalid Token"
                }else if(ws === 4005){
                    closemessage = "4005 Already Authenticated"
                }else if(ws === 4007){
                    closemessage = "4007 Invalid Seq"
                }else if(ws === 4008){
                    closemessage = "4008 Rate Limited"
                }else if(ws === 4009){
                    closemessage = "4009 Season Timeout"
                }else if(ws === 4010){
                    closemessage = "4010 Invalid Shard"
                }else if(ws === 4011){
                    closemessage = "4011 Sharding Required"
                }else if(ws === 4012){
                    closemessage = "4012 Invalid API version"
                }else if(ws === 4013){
                    closemessage = "4013 Invalid Intent(s)"
                }else if(ws === 4014){
                    closemessage = "4014 Disallowed Intent(s)"
                }
                console.log('WebSocket Connection Lost! | Error: ' + closemessage)
            })
        }

        wss.on("close", (data) => {
            tokendb.delete('token')
            if(data === 4004)throw new Error(Errors.INVALID_TOKEN)
        })
        


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
                console.log("If everything went well the bot should be reconnected")
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


    setPresence(name, type, status, afk){
        let typelist = [0, 1, 2, 4]
        let statuscode = ['online', 'dnd', 'idle', 'invisible', 'offline']
        if(typeof name !== 'string')throw new TypeError(Errors.STRING)
        if(typeof type !== 'number')throw new TypeError(Errors.NUMBER)
        if(!typelist.includes(type))throw new Error(Errors.UNKNOWN_STATUSCODE)
        if(typeof status !== 'string')throw new TypeError(Errors.STRING)
        if(!statuscode.includes(status.toLowerCase()))throw new Error(Errors.UNKNOWN_STATUSCODE)
        if(typeof afk !== 'boolean')throw new TypeError(Errors.BOOLEAN)
        let presencedata = {
          "op": 3,
          "d": {
            "since": 91879201,
            "game": {
              "name": name,
              "type": type
            },
            "status": status.toLowerCase(),
            "afk": afk
          }
        }

        wss.send(JSON.stringify(presencedata))
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

    async _patch(){
        var guildoptions = {
          'method': 'GET',
          'headers': {
            'Authorization': `Bot ${tokendb.get('token.token')}`,
          }
        };
        let awaiting = await fetch('https://discordapp.com/api/users/@me/guilds', guildoptions);
        let guildjson = await awaiting.json()
        

        this.guilds = new GuildCollection(guildjson)

        
    }

    

    on(event, callback){
        if(!event)KeyMissingError("event")
        if(!callback)KeyMissingError("callback")
        if(typeof callback !== "function")throw new TypeError(Errors.FUNCTION)


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
                this.type = JSON.parse(data).d.type
                this.tts = JSON.parse(data).d.tts
                this.timestamp = JSON.parse(data).d.timestamp
                this.pinned = JSON.parse(data).d.pinned
                this.mentions = JSON.parse(data).d.mentions
                this.mentionRoles = JSON.parse(data).d.mention_roles
                this.mentionEveryone = JSON.parse(data).d.mention_everyone
                this.member = JSON.parse(data).d.member
                this.id = JSON.parse(data).d.id
                this.flags = JSON.parse(data).d.flags
                this.editedTimestamp = JSON.parse(data).d.edited_timestamp
                this.content = JSON.parse(data).d.content
                this.attachments = JSON.parse(data).d.attachments
                this.guildid = JSON.parse(data).d.guild_id
                this.channelid = JSON.parse(data).d.channel_id
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