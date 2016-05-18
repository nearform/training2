'use strict'
const test = require('tap').test
const keyparser = require('./')
const through = require('through2').obj

test('ctrl + c => die', check('die', {key: {name: 'c', ctrl: true}}))

test('c => reset', check('reset', {key: {name: 'c'}}))

test('b => toggle-backled', check('toggle-backled', {key: {name: 'b'}}))

test('right => right', check('right', {key: {name: 'right'}}))

test('left => left', check('left', {key: {name: 'left'}}))

test('up => roll', check('roll', {key: {name: 'up'}}))

test('down => stop', check('stop', {key: {name: 'down'}}))

test(', => slower', check('slower', {ch: ','}))

test('. => faster', check('faster', {ch: '.'}))

test('unmatched keys are ignored whilst subsequent chunks aren\'t blocked', 
  (assert) => {
    const tester = through((cmd, enc, done) => {
      assert.is(cmd.name, 'roll')
      assert.end()
    })
    const kp = keyparser()
    kp.pipe(tester)
    kp.write({key: {name: 'x'}})
    kp.write({key: {name: 'up'}})
  })

function check(name, keypress) {
  return (assert) => {
    const tester = through((cmd, enc, done) => {
      assert.is(cmd.name, name)
      assert.end()
    })
    const kp = keyparser()
    kp.pipe(tester)
    kp.write(keypress)
  }
}