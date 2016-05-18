'use strict'
const test = require('tap').test
const killer = require('./')
const through = require('through2').obj

test('calls process.exit when command is die', (assert) => {
  assert.plan(1)
  assert.tearDown(() => process.exit = exit)

  const exit = process.exit
  process.exit = () => assert.ok(true, 'process.exit called')

  killer().write({name: 'die'})
})

test('passes all cmds (except die) through the stream', (assert) => {
  const stream = killer

  assert.plan(8)
  check(stream(), {name: 'noop'}, 'noop')
  check(stream(), {name: 'reset'}, 'reset')
  check(stream(), {name: 'left', state: {}}, 'left')
  check(stream(), {name: 'right', state: {}}, 'right')
  check(stream(), {name: 'stop', state: {}}, 'stop')
  check(stream(), {name: 'roll', state: {}}, 'roll')
  check(stream(), {name: 'toggle-backled', state: {}}, 'toggle')
  check(stream(), {name: 'unknown'}, 'unknown')

  function check(stream, candidate, desc) {
    const tester = through((o) => {
      assert.is(candidate, o, desc)
      stream.unpipe(tester)
    })
    stream.write(candidate)
    stream.pipe(tester)
  }

})