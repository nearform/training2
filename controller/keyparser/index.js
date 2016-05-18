'use strict'

const through = require('through2').obj
const keyMap = {
  ctrlc: 'die',
  c: 'reset',
  b: 'toggle-backled',
  up: 'roll',
  down: 'stop',
  ',': 'slower',
  '.': 'faster',
  left: 'left',
  right: 'right'
}

module.exports = () => through(function (keyObj, enc, cb) {
  const input = keyObj.key ? combineModifier(keyObj.key) : keyObj.ch
  const name = keyMap[input]

  if (!name) {
    return cb()
  }

  // tips:
  // output objects with form {name}
  this.push({name})
  cb()
})

function combineModifier (key) {
  const name = key.ctrl ? 'ctrl' : ''

  return name + key.name
}
