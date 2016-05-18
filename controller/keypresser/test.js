'use strict'
const test = require('tap').test
process.stdin.setRawMode = function () {}
const keypresser = require('./')
const through = require('through2').obj

test('stops pushing key objects after stream has ended', (assert) => {
   const kp = keypresser()
   kp.end()
   assert.doesNotThrow(() => process.stdin.push('a'))
   process.stdin.end()
   assert.end()
})

test('converts STDIN input into keypress objects', (assert) => {
  assert.plan(4)
  const kp = keypresser()
  
  const key = through(function (keypress, enc, cb) {
    assert.ok(keypress.key)
    assert.is(keypress.key.name, 'a')
    kp.unpipe(key)
    kp.pipe(ch)
    sendCh()
    cb()
  })

  const ch = through(function (keypress, enc, cb) {
    assert.notOk(keypress.key)
    assert.is(keypress.ch, ',')
    kp.end()
    process.stdin.end()
    cb()
  })

  kp.pipe(key)
  sendKey()

  function sendKey() {
    process.stdin.push('a')
  }
  function sendCh() {
    process.stdin.push(',')  
  }

})