"use strict";

const qdb = require("quick.db")

const request = require("request")
const tokendb = new qdb.table("discordhytoken")

class author {
  constructor(client) {
    this.client = client
  }

  data(){
    return this.client
  }

 }

module.exports = author