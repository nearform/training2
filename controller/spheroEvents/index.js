'use strict'

const thru = require('through2').obj

module.exports = (emitter) => {
  const stream = thru()

  emitter.on('dataStreaming', (data) => {
    console.log(data.xOdometer, data.yOdometer)

    stream.push({
      name: 'loc',
      x: data.xOdometer.value[0],
      y: data.yOdometer.value[0]
    })
  })

  return stream
}
