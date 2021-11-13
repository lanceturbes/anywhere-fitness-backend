const knex = require("knex")
const config = require("../knexfile")
const environment = require("../config").NODE_ENV

const database = knex(config[environment])

module.exports = database
