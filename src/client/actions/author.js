"use strict";

const qdb = require("quick.db")

const request = require("request")
const tokendb = new qdb.table("discordhytoken")

class author {
  constructor(client) {
    this.client = client
    var options = {
      'method': 'GET',
      'url': `https://discordapp.com/api/users/${this.client.id}`,
      'headers': {
        'Authorization': 'Bot ' + tokendb.get('token.token'),
        'Content-Type': 'application/json'
       }
    };
    request(options, function (error, response) { 
      if(JSON.parse(response.body).message === "401: Unauthorized")throw new Error("discord api error: you are not logged in")
      return JSON.parse(response.body)
    });
  }


 }

module.exports = author