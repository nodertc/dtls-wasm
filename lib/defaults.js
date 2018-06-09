const createModule = require('./wasm/create-module')

const socketStore = new Map()
const memory = new WebAssembly.Memory({ initial: 256 })
const wasm = createModule(memory, socketStore)

module.exports = {
  wasm,
  memory,
  socketStore
}
