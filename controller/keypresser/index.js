'use strict'
const through = require('through2').obj
const keypress = require('keypress')
const eos = require('end-of-stream')

process.stdin.setRawMode(true)
process.stdin.resume()
keypress(process.stdin)

module.exports = () => {
  const keypresser = through()

  return keypresser
}

//tips:

// see http://npm.im/keypress 
// push objects onto stream with form {key, ch}
// (literally... `push`)
// use http://npm.im/end-of-stream to determine 
// when stream has closed (for cleanup)