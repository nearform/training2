'use strict'

const through = require('through2').obj

function makeController(heading, speed, backled) {
  heading = typeof heading === 'number' ? heading : 0
  speed = typeof speed === 'number' ? speed : 0.3
  backled = typeof backled === 'boolean' ? backled : true

  return through((cmd, enc, cb) => {
    cmd.state = {
        heading: heading
      , speed: speed
      , backled: backled
    }

    if (cmd.name == 'toggle-backled') {
      cmd.state.backled = !backled
    }

    if (cmd.name == 'right') {
      cmd.state.heading = (cmd.state.heading + 15) % 360
    }

    if (cmd.name == 'left') {
      cmd.state.heading = (360 + cmd.state.heading - 15) % 360
    }

    if (cmd.name == '180') {
      cmd.state.heading = (360 + cmd.state.heading + 180) % 360
    }

    if (cmd.name == 'slower') {
      cmd.state.speed = cmd.state.speed < 0.1 ? 0.1 : cmd.state.speed - 0.1
    }

    if (cmd.name == 'faster') {
      cmd.state.speed = cmd.state.speed > 1 ? 1 : cmd.state.speed + 0.1
    }

    cb(null, cmd)
  })
}

module.exports = makeController

// tips
// output objects in the form {name, state: {heading, speed, backled}}
