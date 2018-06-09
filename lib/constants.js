// GnuTLS socket options.
// @link https://www.gnutls.org/reference/gnutls-gnutls.html#gnutls-init-flags-t
const initFlags = {
  GNUTLS_SERVER: 1,
  GNUTLS_CLIENT: (1 << 1),
  GNUTLS_DATAGRAM: (1 << 2),
  GNUTLS_NONBLOCK: (1 << 3),
  GNUTLS_NO_EXTENSIONS: (1 << 4),
  GNUTLS_NO_REPLAY_PROTECTION: (1 << 5),
  GNUTLS_NO_SIGNAL: (1 << 6),
  GNUTLS_ALLOW_ID_CHANGE: (1 << 7),
  GNUTLS_ENABLE_FALSE_START: (1 << 8),
  GNUTLS_FORCE_CLIENT_CERT: (1 << 9),
  GNUTLS_NO_TICKETS: (1 << 10)
}

// Enumeration of different TLS handshake packets.
// @link https://www.gnutls.org/reference/gnutls-gnutls.html#gnutls-handshake-description-t
const handshakeTypes = {
  GNUTLS_HANDSHAKE_HELLO_REQUEST: 0,
  GNUTLS_HANDSHAKE_CLIENT_HELLO: 1,
  GNUTLS_HANDSHAKE_SERVER_HELLO: 2,
  GNUTLS_HANDSHAKE_HELLO_VERIFY_REQUEST: 3,
  GNUTLS_HANDSHAKE_NEW_SESSION_TICKET: 4,
  GNUTLS_HANDSHAKE_CERTIFICATE_PKT: 11,
  GNUTLS_HANDSHAKE_SERVER_KEY_EXCHANGE: 12,
  GNUTLS_HANDSHAKE_CERTIFICATE_REQUEST: 13,
  GNUTLS_HANDSHAKE_SERVER_HELLO_DONE: 14,
  GNUTLS_HANDSHAKE_CERTIFICATE_VERIFY: 15,
  GNUTLS_HANDSHAKE_CLIENT_KEY_EXCHANGE: 16,
  GNUTLS_HANDSHAKE_FINISHED: 20,
  GNUTLS_HANDSHAKE_CERTIFICATE_STATUS: 22,
  GNUTLS_HANDSHAKE_SUPPLEMENTAL: 23,
  GNUTLS_HANDSHAKE_CHANGE_CIPHER_SPEC: 254,
  GNUTLS_HANDSHAKE_CLIENT_HELLO_V2: 1024,
  GNUTLS_HANDSHAKE_ANY: -1,
}

// The hook types for gnutls_handshake_set_hook_function
// @link https://www.gnutls.org/reference/gnutls-gnutls.html#gnutls-handshake-set-hook-function
const hookTypes = {
  GNUTLS_HOOK_POST: 1,
  GNUTLS_HOOK_PRE: 0,
  GNUTLS_HOOK_BOTH: -1
}

const GNUTLS_COOKIE_KEY_SIZE = 16

module.exports = {
  initFlags,
  handshakeTypes,
  hookTypes,
  GNUTLS_COOKIE_KEY_SIZE
}
