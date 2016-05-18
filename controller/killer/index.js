'use strict'
const through = require('through2').obj

module.exports = () => through(function(cmd, enc, done) {
  if (cmd.name === 'die') {
    process.exit()
  }
  done(null, cmd)
})