'use strict'

const through = require('through2').obj

function makeController(heading, speed, backled) {
  heading = typeof heading === 'number' ? heading : 0
  speed = typeof speed === 'number' ? speed : 0.3
  backled = typeof backled === 'boolean' ? backled : true

  return through((cmd, enc, cb) => {

    if (cmd.name == 'toggle-backled') {
      backled = !backled
    }

    if (cmd.name == 'right') {
      heading = (heading + 15) % 360
    }

    if (cmd.name == 'left') {
      heading = (360 + heading - 15) % 360
    }

    if (cmd.name == '180') {
      heading = (360 + heading + 180) % 360
    }

    if (cmd.name == 'slower') {
      speed = speed - 0.1
      speed = speed < 0.1 ? 0.1 : speed
    }

    if (cmd.name == 'faster') {
      speed = speed + 0.1
      speed = speed > 1 ? 1 : speed
    }

    cmd.state = {
        heading: heading
      , speed: speed
      , backled: backled
    }

    cb(null, cmd)
  })
}

module.exports = makeController

// tips
// output objects in the form {name, state: {heading, speed, backled}}
