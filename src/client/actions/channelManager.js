"use strict";

const qdb = require("quick.db")

const request = require("request")
const tokendb = new qdb.table("discordhytoken")
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
class channel {
  constructor(client) {
    this.client = client

    return this.client
  }

  send(content){
    if(!content)throw new Error("Content to send not defined!")
        
        let msg;
        if(IsJsonString(content) === false){
            msg = {
                "content": content,
	            "embed": {}
            }
        }else{
            msg = {
                "content": "",
	            "embed": content
            }
        }
        var options = {
          'method': 'POST',
          'url': `https://discordapp.com/api/channels/${this.client.channel_id}/messages`,
          'headers': {
            'Authorization': `Bot ${tokendb.get('token.token')}`,
            'content-type': 'application/json',
            'Cookie': '__cfduid=d691ce9608d2f2417dea1a984b9cb46aa1587146073; __cfruid=1c5bf67d2aa9e7bc76ced134a29a051b862dc121-1587146073'
          },
          body: JSON.stringify(msg)
        };
        console.log(msg)
        request(options, function (error, response) { 
          if(JSON.parse(response.body).message === "Unknown Channel")throw new Error("Discord API error: I can't find the channel")
          if(JSON.parse(response.body).message === "401: Unauthorized")throw new Error("discord api error: you are not logged in");
        });
  }
  
}

module.exports = channel