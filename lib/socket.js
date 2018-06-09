const { Duplex } = require('stream')
const unicast = require('unicast')
const Session = require('./session')
const defaults = require('./defaults')

const _session = Symbol('session')
const _transport = Symbol('transport')
const _module = Symbol('module')
const _sstore = Symbol('sstore')
const _destroyed = Symbol('destroyed')

module.exports = class Socket extends Duplex {
  constructor(options = {}) {
    super()

    // Create UDP unicast transport.
    this[_transport] = unicast.createSocket(options)

    // Get instance of internal DTLS module.
    this[_module] = options.module || defaults.wasm

    // Create DTLS session.
    this[_session] = new Session(this[_module], options.flags || 0)

    /** @type {Map} */
    const socketStore = options.socketStore || defaults.socketStore
    this[_sstore] = socketStore

    // Save the link between the socket and GnuTLS session.
    socketStore.set(this[_session].ptr, this)

    this[_destroyed] = false
  }

  /**
   * @returns {unicast.Socket}
   */
  get transport() {
    return this[_transport]
  }

  /**
   * @returns {Session}
   */
  get session() {
    return this[_session]
  }

  _read() {}

  _write() {}

  close() {
    if (this[_destroyed]) {
      return
    }

    this[_destroyed] = true

    this[_sstore].delete(this[_session].ptr)
    this[_sstore] = null

    this[_session].close()
    this[_session] = null

    this[_transport].close()
    this[_transport] = null

    this[_module] = null
  }
}
