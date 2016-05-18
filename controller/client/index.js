'use strict'

const through = require('through2')
const reconnect = require('reconnect-net')
const eos = require('end-of-stream')

module.exports = function (port) {
  const stream = through()
  

  return stream
}

// tips 
// use `reconnect-net` (see http://npm.im/reconnect-net and http://npm.im/reconnect)
// `stream` is a proxy stream for the connection, the connection can be
// be replaced at any time (due to a reconnect)
// we will need to unpipe the old connection, and pipe a new connection 
// to the stream
// the pipe line should be circular connection => stream => connection 
// this ensures our "proxy stream" gets both reads and writes from the
// current connection
// use end-of-stream to disconnect the client on stream end