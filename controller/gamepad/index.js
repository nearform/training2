'use strict'

const through = require('through2').obj

function makeGamepad(nes) {
  var gamepad = through()
  nes.on('x:move', function(pos) {
    pos = ~~pos
    if (pos) {
      gamepad.write({name: pos < 0 ? 'left' : 'right'})
      return
    }
    gamepad.write({name: 'release'})
  })

  nes.on("y:move", function(pos) {
    pos = ~~pos
    if (pos) {
      gamepad.write({name: pos < 0 ? 'up' : 'down'})
      return
    }
    gamepad.write({name: 'release'})
  })

  ;['a', 'b', 'select', 'start'].forEach(function(button) {
    nes.on(button + ":press", function() {
      gamepad.write({name: button})
    })
  })

  return gamepad
}

module.exports = makeGamepad