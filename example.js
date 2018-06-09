const { Socket } = require('./index')

const socket = new Socket({
  flags: constants.initFlags.GNUTLS_CLIENT | constants.initFlags.GNUTLS_NO_REPLAY_PROTECTION,
  type: 'udp4',
  port: 1111,
  remotePort: 4444,
  remoteAddress: '127.0.0.1'
})
