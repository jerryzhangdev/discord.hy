"use strict";

const qdb = require("quick.db")
const request = require("request")
const tokendb = new qdb.table("discordhytoken")
const fetch = require("node-fetch")
const { Errors, KeyMissingError } = require("../../Error/Errors.js")
class guildManager {
  constructor(guildid) {
    this.client = JSON.parse(guildid)

    if(guildid) this._patch()
  }



_patch(){
    let client = this.client

    this.id = client.id

    this.name = client.name

    this.icon = client.icon

    this.description = client.description

    this.splash = client.splash

    this.features = client.features

    this.emojis = client.emojis

    this.banner = client.banner

    this.ownerID = client.owner_id

    this.applicationID = client.application_id

    this.region = client.region

    this.afkChannelID = client.afk_channel_id

    this.afkTimeout = client.afk_timeout

    this.widgetEnabled = client.widget_enabled

    this.widgetChannelID = client.widget_channel_id

    this.verificationLevel = client.verification_level

    this.roles = client.roles

    this.defaultMessageVerifications = client.default_message_verifications

    this.mfaLevel = client.mfa_level

    this.explicitContentFilter = client.explicit_content_filter

    this.maxPresences = client.max_presences

    this.maxMembers = client.max_members

    this.maxVideoChannelUsers = client.max_video_channel_users

    this.vanityUrl = client.vanity_url_code

    this.premiumTier = client.premium_tier

    this.premiumSupscriptionCount = client.premium_supscription_count

    this.systemChannelFlags = client.system_channel_flags

    this.systemChannelID = client.system_channel_id

    this.preferredLocale = client.preferred_locale

    this.rulesChannelID = client.rules_channel_id

    this.publicUpdatesChannelID = client.public_updates_channel_id

    this.embedEnabled = client.embed_enabled

    this.embedChannelID = client.embed_channel_id
}




    getPreview(){
        var options = {
          'method': 'GET',
          'url': `https://discordapp.com/api/guilds/${this.client.id}/preview`,
          'headers': {
            'Authorization': `Bot ${tokendb.get("token.token")}`,
          }
        };
        
        return new Promise(function(resolve, reject){
        request(options, function(error, response){
          if(JSON.parse(response.body).message === "401: Unauthorized")throw new Error(Errors.UNAUTHORIZED)
          if(JSON.parse(response.body).message === "Unknown Guild")console.error(Errors.UNKNOWN_GUILD)
          
          return resolve(JSON.parse(response.body))
        })
        })
        

    }



    
    setName(name){
        var options = {
          'method': 'PATCH',
          'url': `https://discordapp.com/api/guilds/${this.client.id}`,
          'headers': {
            'Authorization': `Bot ${tokendb.get('token.token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({"name": name})

        };
        return new Promise(function(resolve, reject){
        request(options, function (error, response) { 
          if(JSON.parse(response.body).message === "401: Unauthorized")throw new Error(Errors.UNAUTHORIZED)
          if(JSON.parse(response.body).message === "Unknown Guild")console.error(Errors.UNKNOWN_GUILD)
          return resolve(JSON.parse(response.body))
        });
        })
	}

 }

module.exports = guildManager