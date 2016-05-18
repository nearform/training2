'use strict'

const through = require('through2').obj
const status = require('node-status')

module.exports = locprinter

function locprinter() {
  var location = status.addItem('location', {
    type: 'text',
    name: 'Location'
  })
  // global.console = status.console()
  status.start({
    uptime: false
  })

  var stream = through(function(cmd, enc, done) {
    if (cmd.name === 'loc') {
      location.text = 'x:' + cmd.x + ' y:' + cmd.y
    }
    if (cmd.name === 'die') {
      status.clear()
      status.stop()
    }
    done(null, cmd)
  })

  stream.location = location

  return stream

}
