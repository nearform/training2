'use strict'

const through = require('through2').obj
const buttonMap = {
  start: 'reset',
  select: 'toggle-backled',
  right: 'right',
  left: 'left',
  up: 'roll',
  down: '180',
  release: 'stop',
  a: 'faster',
  b: 'slower'
}
var gamepadParser = () => through(function (btn, enc, done) {
  const name = buttonMap[btn.name] || 'noop'
  done(null, {name})
})

module.exports = gamepadParser
