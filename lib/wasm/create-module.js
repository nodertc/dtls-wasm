const fs = require('fs')
const path = require('path')
const { createImport } = require('./import')
const binary = fs.readFileSync(path.resolve(__dirname, '../../src/dtls.wasm'))
const emscripten = require('../../src/dtls')

module.exports = createModule

/**
 * Create new instance of WASM module.
 * @param {WebAssembly.Memory} memory
 * @param {Map} socketStore
 */
function createModule(memory, socketStore) {
  if (!(memory instanceof WebAssembly.Memory)) {
    throw new TypeError('Expected WebAssembly.Memory instance.')
  }
  const importTable = createImport(memory, socketStore)
  const wasm = emscripten({
    instantiateWasm(imports) {
      Object.assign(imports.env, importTable, { memory })

      const wamodule = new WebAssembly.Module(binary)
      const instance = new WebAssembly.Instance(wamodule, imports)

      return instance.exports
    }
  })

  wasm._gnutls_global_set_log_level(100)
  const code = wasm._main()

  if (code < 0) {
    // See description in http://gnu.ist.utl.pt/software/gnutls/manual/html_node/Error-codes-and-descriptions.html.
    // See codes in gnutls.h
    throw new Error(`[${code}] invalid init.`)
  }

  return wasm
}
