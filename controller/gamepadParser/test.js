'use strict'
const test = require('tap').test
const gamepadParser = require('./')()
const through = require('through2').obj

test('start => reset', check('reset', {name: 'start'}))

test('select => toggle-backled', check('toggle-backled', {name: 'select'}))

test('right => right', check('right', {name: 'right'}))

test('left => left', check('left', {name: 'left'}))

test('up => roll', check('roll', {name: 'up'}))

test('down => 180', check('180', {name: 'down'}))

test('release => stop', check('stop', {name: 'release'}))

test('b => slower', check('slower', {name: 'b'}))

test('a => faster', check('faster', {name: 'a'}))

function check(name, keypress) {
  return (assert) => {
    const tester = through(function (cmd, enc, done) {
      assert.is(cmd.name, name)
      assert.end()
      gamepadParser.unpipe(tester)
    })

    gamepadParser.pipe(tester)
    gamepadParser.write(keypress)
  }
}