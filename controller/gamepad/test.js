'use strict'
const test = require('tap').test
const makeGamepad = require('./')
const EventEmitter = require('events')
const through = require('through2').obj

test('← => left', check('left', 'x:move', -1))
test('→ => right', check('right', 'x:move', 1))
test('↑ => up', check('up', 'y:move', -1))
test('↓ => down', check('down', 'y:move', 1))
test('ⓐ => a', check('a', 'a:press'))
test('ⓑ => b', check('b', 'b:press'))
test('sᴇʟᴇᴄᴛ => select', check('select', 'select:press'))
test('sᴛᴀʀᴛ => start', check('start', 'start:press'))

function check(name, event, data) {
  return (assert) => {
    const mockGamepad = new EventEmitter
    const gamepad = makeGamepad(mockGamepad)

    const tester = through(function (button, enc, cb) {
      assert.is(button.name, name)
      assert.end()
      gamepad.unpipe(tester)
      cb()
    })

    gamepad.pipe(tester)

    mockGamepad.emit(event, data)
  }
}