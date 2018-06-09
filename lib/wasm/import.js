const date2buffer = require('date2buffer')
const getHandshakeName = require('../util/get-handshake-name')
const debug = require('../util/debug')
// const sessionStore

module.exports = {
  logger,
  auditLog,
  onCertificateVerify,
  onhandshake,
  time,
  read,
  write,
  pointer2string,
  createImport
}

/**
 * Custom logger for dtls.
 *
 * @param {number} level
 * @param {number} line
 */
function logger(level, line) {
  console.log('[log] %s', pointer2string(this.memory, line))
}

/**
 * Security logger for dtls.
 *
 * @param {number} session
 * @param {number} line
 */
function auditLog(session, line) {
  console.log('[audit log] %s', pointer2string(this.memory, line))
}

/**
 * Custom `time()` function.
 */
function time(addr, size) {
  const buf = Buffer.from(this.memory.buffer, addr, size)
  const unixtime = ~~(Date.now() / 1e3)

  buf.writeUInt32BE(unixtime)
}

/**
 * Wrapper for send data. This method called by wasm.
 *
 * @param {number} csession - ptr to dtls_session_t.
 * @param {number} pdata - ptr to data want to send.
 * @param {number} size - size of data want to send.
 */
function write(csession, pdata, size) {
  // The callback should return a positive number
  // indicating the bytes sent, and -1 on error.
  const socket = this.socketStore.get(csession)

  debug('call _dtls_js_write()')

  // Session not found.
  if (!socket) {
    debug('socket not found')
    return -1
  }

  // Copy data from wasm memory to node memory.
  const view = Buffer.from(this.memory.buffer, pdata, size)
  const packet = Buffer.allocUnsafe(size)

  view.copy(packet)

  // Send data to the remote peer.
  socket.transport.write(packet)

  // Unable to detect the real number of transfered data,
  // So return packet size.
  return packet.length
}

/**
 * Wrapper for receive data. This method called by wasm.
 * This method will called after `readable` event.
 * We are sure that data exist.
 *
 * @param {number} csession - ptr to dtls_session_t.
 * @param {number} cdata - ptr to allocated memory to write data want to read.
 * @param {number} size - size of allocated memory.
 */
function read(csession, cdata, size) {
  // The callback should return 0 on connection termination,
  // a positive number indicating the number of bytes received,
  // and -1 on error.
  const socket = this.socketStore.get(csession)

  debug('call _dtls_js_read()')

  if (!socket) {
    debug('session not found')
    return -1
  }

  // TODO: return 0 when socket closed

  // Read the packet. Data should exist.
  let packet = socket.transport.read()

  // Packet shold be less or equals to size
  // of an allocated memory.
  if (packet.length > size) {
    debug('split packet from %s bytes to %s', packet.length, size)
    const [first, last] = packet.slice(size)

    packet = first
    socket.transport.unshift(last)
  }

  const view = Buffer.from(this.memory.buffer)
  packet.copy(view, cdata)

  // Return size of written packet.
  return packet.length
}

/**
 * Validate received certificate.
 *
 * @param {number} psession - ptr to dtls_session_t.
 * @param {number} ccerts - ptr to received certificates data.
 * @param {number} size - size of received certificates.
 * @param {number} count - the number of received certificates.
 */
function onCertificateVerify(psession, ccerts, size, count) {
  debug('call _dtls_js_certificate_verify()')
  const certificates = Buffer.from(this.memory.buffer, ccerts, size)

  debug('got certificates %s bytes', size)
  return 0
}

// This callback must return 0 on success or
// a gnutls error code to terminate the handshake.
function onhandshake(session, htype, incoming) {
  debug('%s message %s', incoming ? 'send' : 'got', getHandshakeName(htype))

  return 0
}

function pointer2string(memory, ptr, encoding = 'ascii') {
  const view = Buffer.from(memory.buffer, ptr)
  let end = 0

  while (end < view.length) {
    if (view[end] === 0) {
      break
    }

    ++end
  }

  if (end === view.length) {
    const err = new Error(`Not found \0 symbol since ${ptr} byte.`)

    process.emitWarning(err)
    console.warning(err.message)
    return ''
  }

  return view.toString(encoding, 0, end)
}

/**
 * Create WASM import table.
 * @param {WebAssembly.Memory} memory
 * @param {Map} socketStore
 * @param {object} options
 */
function createImport(memory, socketStore) {
  const that = {
    memory,
    socketStore
  }

  return {
    _dtls_js_log: logger.bind(that),
    _dtls_js_audit_log: auditLog.bind(that),
    _dtls_js_certificate_verify: onCertificateVerify.bind(that),
    _dtls_js_handshake_hook_func: onhandshake.bind(that),
    _dtls_js_time: time.bind(that),
    _dtls_js_read: read.bind(that),
    _dtls_js_write: write.bind(that)
  }
}
