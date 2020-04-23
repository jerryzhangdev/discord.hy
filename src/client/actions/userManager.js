"use strict";

const qdb = require("quick.db")

const request = require("request")
const tokendb = new qdb.table("discordhytoken")
const { DiscordAPI, TypeErrors, KeyMissingError, httpErrors } = require("../../Error/Errors.js")
class userManager {
  constructor(client) {
    this.client = client
    if(client) this._patch()
  }
  /*
  {
    username: 'Nitrogen',
    public_flags: 0,
    id: '688427085617692960',
    discriminator: '0862',
    bot: true,
    avatar: null
  }
  */
  _patch(){
    this.username = this.client.username;
    this.id = this.client.id;
    this.publicFlags = this.client.public_flags;
    this.discriminator = this.client.discriminator;
    this.tag = this.client.username + '#' + this.client.discriminator;
    if(this.client.bot){
    this.bot = true
    }
  }

  sendMessage(content){
  if(content === "")throw new Error("cannot send an empty message")
    var options = {
      'method': 'POST',
      'url': 'https://discordapp.com/api/users/@me/channels',
      'headers': {
        'Authorization': `Bot ${tokendb.get("token.token")}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"recipient_id": this.client.id})

    };
    request(options, function (error, response) { 
          if(JSON.parse(response.body).message === "Unknown Channel")KeyMissingError("channel")
          if(JSON.parse(response.body).message === "401: Unauthorized")throw new Error(httpErrors.UNAUTHORIZED)
        var options = {
          'method': 'POST',
          'url': `https://discordapp.com/api/channels/${JSON.parse(response.body).id}/messages`,
          'headers': {
            'Authorization': `Bot ${tokendb.get('token.token')}`,
            'content-type': 'application/json',
            'Cookie': '__cfduid=d691ce9608d2f2417dea1a984b9cb46aa1587146073; __cfruid=1c5bf67d2aa9e7bc76ced134a29a051b862dc121-1587146073'
          },
          body: JSON.stringify({ "content": content })
        };
        request(options, function (error, res) { 
          if(JSON.parse(res.body).message === "Unknown Channel")console.error(DiscordAPI.UNKNOWN_CHANNEL)
          if(JSON.parse(res.body).message === "401: Unauthorized")throw new Error(httpErrors.UNAUTHORIZED);
          return JSON.parse(res.body)
        });
    });

  }


    sendEmbed(content){
    if(!content)throw new Error("Content to send not defined")
    if(content === "")throw new Error("cannot send an empty message")
    var options = {
      'method': 'POST',
      'url': 'https://discordapp.com/api/users/@me/channels',
      'headers': {
        'Authorization': `Bot ${tokendb.get("token.token")}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"recipient_id":"539195184357965833"})

    };
    request(options, function (error, response) { 
          if(JSON.parse(response.body).message === "Unknown Channel")console.error(httpErrors.UNKNOWN_CHANNEL)
          if(JSON.parse(response.body).message === "401: Unauthorized")throw new Error(httpErrors.UNAUTHORIZED);
        let msg;
            msg = {
                "content": "",
	            "embed": content.toJSON()
            }
        var option = {
          'method': 'POST',
          'url': `https://discordapp.com/api/channels/${JSON.parse(response.body).id}/messages`,
          'headers': {
            'Authorization': `Bot ${tokendb.get('token.token')}`,
            'content-type': 'application/json',
            'Cookie': '__cfduid=d691ce9608d2f2417dea1a984b9cb46aa1587146073; __cfruid=1c5bf67d2aa9e7bc76ced134a29a051b862dc121-1587146073'
          },
          body: JSON.stringify(msg)
        };
        request(option, function (error, response) { 
          if(JSON.parse(response.body).message === "Unknown Channel")console.error(httpErrors.UNKNOWN_CHANNEL)
          if(JSON.parse(response.body).message === "401: Unauthorized")throw new Error(httpErrors.UNAUTHORIZED);
          return JSON.parse(response.body)
        });
    });

  }



  avatarURL(){
    if(this.client.avatar.startsWith("a_")){
            return `https://cdn.discordapp.com/avatars/${this.client.id}/${this.client.avatar}.gif`
    }else if(this.client.avatar === "null"){
            return `https://images-ext-2.discordapp.net/external/NAqkMZNPJgDiWBrSDqniAD1_sbWfiPqF4mgZyCtVs6s/https/discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png`
    }else{
            return `https://cdn.discordapp.com/avatars/${this.client.id}/${this.client.avatar}.png`
    }
  }

  defaultAvatarURL(){
    return `https://images-ext-2.discordapp.net/external/NAqkMZNPJgDiWBrSDqniAD1_sbWfiPqF4mgZyCtVs6s/https/discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png`
  }

 }

module.exports = userManager