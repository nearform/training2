'use strict'
const test = require('tap').test
const makeController = require('./')
const through = require('through2').obj

test('default state', (assert) => {
  const controller = makeController()
  const tester = through(function (cmd, enc, done) {
    assert.is(cmd.state.heading, 0)
    assert.is(cmd.state.speed, .3)
    assert.is(cmd.state.backled, true)
    assert.end()
  })
  controller.pipe(tester)
  controller.write({name: 'noop'})
})

test('toggle-backled', (assert) => {
  const backled = false
  const controller = makeController(0, 0, backled)

  const tester = through(function (cmd, enc, done) {
    assert.is(cmd.state.backled, true)
    assert.end()
  })

  controller.pipe(tester)
  controller.write({name: 'toggle-backled'})
})

test('right', (assert) => {
  const heading = 180
  const controller = makeController(heading, 0, false)

  const tester = through(function (cmd, enc, done) {
    assert.is(cmd.state.heading, 195)
    assert.end()
  })

  controller.pipe(tester)
  controller.write({name: 'right'})
})

test('left', (assert) => {
  const heading = 180
  const controller = makeController(heading, 0, false)

  const tester = through(function (cmd, enc, done) {
    assert.is(cmd.state.heading, 165)
    assert.end()
  })

  controller.pipe(tester)
  controller.write({name: 'left'})
})

test('180', (assert) => {
  const heading = 90
  const controller = makeController(heading, 0, false)

  const tester = through(function (cmd, enc, done) {
    assert.is(cmd.state.heading, 270)
    assert.end()
  })

  controller.pipe(tester)
  controller.write({name: '180'})
})

test('slower', (assert) => {
  const speed = .5
  const controller = makeController(0, speed, false)

  const tester = through(function (cmd, enc, done) {
    assert.is(cmd.state.speed, .4)
    assert.end()
  })

  controller.pipe(tester)
  controller.write({name: 'slower'})
})

test('faster', (assert) => {
  const speed = .5
  const controller = makeController(0, speed, false)

  const tester = through(function (cmd, enc, done) {
    assert.is(cmd.state.speed, .6)
    assert.end()
  })

  controller.pipe(tester)
  controller.write({name: 'faster'})
})

test('passes all cmds through the stream', (assert) => {
  const stream = makeController

  assert.plan(9)
  check(stream(), {name: 'noop'}, 'noop')
  check(stream(), {name: 'reset'}, 'reset')
  check(stream(), {name: 'left', state: {}}, 'left')
  check(stream(), {name: 'right', state: {}}, 'right')
  check(stream(), {name: 'stop', state: {}}, 'stop')
  check(stream(), {name: 'roll', state: {}}, 'roll')
  check(stream(), {name: 'toggle-backled', state: {}}, 'toggle')
  check(stream(), {name: 'unknown'}, 'unknown')
  check(stream(), {name: 'die'}, 'die')

  function check(stream, candidate, desc) {
    const tester = through((o) => {
      assert.is(candidate, o, desc)
      stream.unpipe(tester)
    })
    stream.write(candidate)
    stream.pipe(tester)
  }

})
