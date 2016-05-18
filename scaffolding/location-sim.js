'use strict'
const through = require('through2').obj

module.exports = locationSim

function locationSim() {
  let x = 0
  let y = 0
  let heading = 0
  let speed = 0.3
  let backled = true
  let intvl
  const stream = through((o, enc, cb) => {
    if (o.state) { 
      heading = o.state.heading 
      speed = o.state.speed
      backled = o.state.backled
    }
    cb(null, o)
    if (o.name === 'roll') {
      intvl = intvl || setInterval(() => {
        y = y + (10 * speed) * Math.cos(heading * Math.PI / 180)
        x = x + (10 * speed) * Math.sin(heading * Math.PI / 180)
        stream.write({
          name: 'loc',
          x: Math.floor(x),
          y: Math.floor(y),
          state: {
            heading: heading,
            speed: speed,
            backled: backled
          }
        })
      }, 250)
      return
    }

    if (o.name === 'left' || o.name === 'right') {
      stream.write({
        name: 'loc',
        x: Math.floor(x),
        y: Math.floor(y),
        state: {
          heading: heading,
          speed: speed,
          backled: backled
        }
      })
    }

    if (o.name === 'stop') {
      clearInterval(intvl)
      intvl = null
    }
  })

  return stream
}