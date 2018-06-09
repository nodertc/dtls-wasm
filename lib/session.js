const Emitter = require('events')
const { initFlags: { GNUTLS_DATAGRAM, GNUTLS_NONBLOCK } } = require('./constants')
const debug = require('./util/debug')
const { pointer2string } = require('./wasm/import')

const pSession = Symbol('session')
const pModule = Symbol('module')

/**
 * This class implements DTLS secure session.
 */
module.exports = class Session extends Emitter {
  constructor(wasm, flags = 0) {
    super()

    debug('start new session')

    // Save the link to internal DTLS module.
    this[pModule] = wasm

    // Create WebAssembly session.
    this[pSession] = wasm._dtls_alloc_session()

    const status = wasm._dtls_setup_session(this[pSession], flags | GNUTLS_DATAGRAM | GNUTLS_NONBLOCK)

    if (status < 0) {
      const ptr = wasm._gnutls_strerror(status)
      const code = Buffer.from(wasm.buffer).toString('hex', ptr, ptr + 5)
      throw new Error(`[status=${status}, ptr=${ptr}, code=${code}] Unable to start dtls session.`)
    }
  }

  get ptr() {
    return this[pSession]
  }

  close() {
    if (this[pSession] === null) {
      return
    }

    debug('close session')

    this[pModule]._dtls_close_session(this[pSession])
    this[pSession] = null
    this[pModule] = null
  }
}
