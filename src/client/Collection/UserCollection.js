"use strict";

const qdb = require("quick.db")
const { Errors, KeyMissingError } = require("../../Error/Errors.js")
const request = require("request")
const tokendb = new qdb.table("discordhytoken")
class UserCollection {
  constructor(client) {
    this.client = client


    this._patch()
  }

  _patch(){
    this.size = this.client.length
  }
  
};

module.exports = UserCollection