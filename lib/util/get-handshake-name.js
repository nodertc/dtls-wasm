const { handshakeTypes } = require('../constants')

module.exports = getHandshakeName

/**
 * Get the name of the packet by type.
 * @param {gnutls_handshake_description_t} type
 */
function getHandshakeName(type) {
  switch (type) {
    case handshakeTypes.GNUTLS_HANDSHAKE_HELLO_REQUEST:
      return 'helloRequest'
    case handshakeTypes.GNUTLS_HANDSHAKE_CLIENT_HELLO:
      return 'clientHello'
    case handshakeTypes.GNUTLS_HANDSHAKE_SERVER_HELLO:
      return 'serverHello'
    case handshakeTypes.GNUTLS_HANDSHAKE_HELLO_VERIFY_REQUEST:
      return 'helloVerifyRequest'
    case handshakeTypes.GNUTLS_HANDSHAKE_NEW_SESSION_TICKET:
      return 'newSessionTicket'
    case handshakeTypes.GNUTLS_HANDSHAKE_CERTIFICATE_PKT:
      return 'certificate'
    case handshakeTypes.GNUTLS_HANDSHAKE_SERVER_KEY_EXCHANGE:
      return 'serverKeyExchange'
    case handshakeTypes.GNUTLS_HANDSHAKE_CERTIFICATE_REQUEST:
      return 'certificateRequest'
    case handshakeTypes.GNUTLS_HANDSHAKE_SERVER_HELLO_DONE:
      return 'serverHelloDone'
    case handshakeTypes.GNUTLS_HANDSHAKE_CERTIFICATE_VERIFY:
      return 'certificateVerify'
    case handshakeTypes.GNUTLS_HANDSHAKE_CLIENT_KEY_EXCHANGE:
      return 'clientKeyExchange'
    case handshakeTypes.GNUTLS_HANDSHAKE_FINISHED:
      return 'finished'
    case handshakeTypes.GNUTLS_HANDSHAKE_CERTIFICATE_STATUS:
      return 'certificateStatus'
    case handshakeTypes.GNUTLS_HANDSHAKE_SUPPLEMENTAL:
      return 'supplemental'
    case handshakeTypes.GNUTLS_HANDSHAKE_CHANGE_CIPHER_SPEC:
      return 'changeCipherSpec'
    case handshakeTypes.GNUTLS_HANDSHAKE_CLIENT_HELLO_V2:
      return 'clientHelloV2'
    default:
      return null
  }
}
