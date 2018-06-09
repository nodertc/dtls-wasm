const { wasm } = require('./defaults')

const GNUTLS_MAJOR = wasm._dtls_gnutls_version_major()
const GNUTLS_MINOR = wasm._dtls_gnutls_version_minor()
const GNUTLS_PATCH = wasm._dtls_gnutls_version_patch()

const GMP_MAJOR = wasm._dtls_gmp_version_major()
const GMP_MINOR = wasm._dtls_gmp_version_minor()
const GMP_PATCH = wasm._dtls_gmp_version_patch()

const NETTLE_MAJOR = wasm._nettle_version_major()
const NETTLE_MINOR = wasm._nettle_version_minor()

module.exports = {
  gnutls: `${GNUTLS_MAJOR}.${GNUTLS_MINOR}.${GNUTLS_PATCH}`,
  gmp: `${GMP_MAJOR}.${GMP_MINOR}.${GMP_PATCH}`,
  nettle: `${NETTLE_MAJOR}.${NETTLE_MINOR}`
}
