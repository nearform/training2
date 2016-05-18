'use strict'

const through = require('through2').obj

var gamepadParser = () => through(function(btn, enc, done) {
  var cmd = {name: 'noop'}
  if (btn.name === 'start') { cmd.name = 'reset' }
  if (btn.name === 'select') { cmd.name = 'toggle-backled' }
  if (btn.name === 'right') { cmd.name = 'right' }
  if (btn.name === 'left') { cmd.name = 'left' }
  if (btn.name === 'up') { cmd.name = 'roll' }
  if (btn.name === 'down') { cmd.name = '180' }
  if (btn.name === 'release') { cmd.name = 'stop' }
  if (btn.name === 'a') { cmd.name = 'faster' }
  if (btn.name === 'b') { cmd.name = 'slower' }  
  
  done(null, cmd)
})

module.exports = gamepadParser