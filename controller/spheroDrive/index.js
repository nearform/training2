'use strict'

const thru = require('through2').obj

module.exports = (opts) => {

  const stream = thru((data, _, cb) => {

    if (data.name === 'reset') {
      opts.randomColor(() => {
        opts.configureLocator({
          flags: 0x01,
          x: 0,
          y: 0,
          yawTare: 0
        })
      })
    }

    if (data.name === 'toggle-backled' && data.state) {
      const backled = data.state.backled ? 255 : 0
      opts.setBackLed(backled)
    }

    if ((data.name === 'right' || data.name === 'left') && data.state) {
      const heading = data.state.heading
      opts.roll(1, heading)
    }

    if (data.name === 'roll' && data.state) {
      const heading = data.state.heading
      const speed = data.state.speed * 255
      opts.roll(speed, heading)
    }

    if (data.name === 'stop') {
      opts.roll(0)
    }

    if (data.name === 'die') {
      opts.halt()
    }

    cb(null, data)
  })

  return stream
}
