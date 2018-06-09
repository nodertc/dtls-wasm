const version = require('./lib/versions')
const constants = require('./lib/constants')
const createModule = require('./lib/wasm/create-module')
const Session = require('./lib/session')
const Socket = require('./lib/socket')

module.exports = {
  version: Object.freeze(version),
  constants,
  createModule,
  Session,
  Socket
}
