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
      , backled: (backled === true ? false : true )
    }

    cb(null, cmd)
  })
}

module.exports = makeController

// tips
// output objects in the form {name, state: {heading, speed, backled}}
