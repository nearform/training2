'use strict'
const test = require('tap').test
const makeSpheroDrive = require('./')
const through = require('through2').obj

test('reset command', (assert) => {
  assert.plan(5)
  const mockBall = {
    randomColor: (cb) => {
      assert.ok(true, 'calls randomColor')
      cb()
    },
    configureLocator: (opts) => {
      assert.is(opts.flags, 0x01, 'calls configureLocator with flags: 0x01')
      assert.is(opts.x, 0, 'calls configureLocator with x: 0')
      assert.is(opts.y, 0, 'calls configureLocator with y: 0')
      assert.is(opts.yawTare, 0, 'calls configureLocator with yawTare: 0')
    }
  }
  const spheroDrive = makeSpheroDrive(mockBall)
  spheroDrive.write({name: 'reset'})
})

test('toggle-backled command', (assert) => {
  assert.plan(2)
  makeSpheroDrive({
    setBackLed: (n) => {
      assert.is(n, 255, 'if backled is true, set balls back LED to 255')
    }
  }).write({name: 'toggle-backled', state: {backled: true}})

  makeSpheroDrive({
    setBackLed: (n) => {
      assert.is(n, 0, 'if backled is false, set balls back LED to 0')
    }
  }).write({name: 'toggle-backled', state: {backled: false}})
})

test('right command', (assert) => {
  assert.plan(1)
  makeSpheroDrive({
    roll: (speed, heading) => {
      assert.is(heading, 50, 'roll ball according to state heading')
    }
  }).write({name: 'right', state: {heading: 50}})
})

test('left command', (assert) => {
  assert.plan(1)
  makeSpheroDrive({
    roll: (speed, heading) => {
      assert.is(heading, 50, 'roll ball according to state heading')
    }
  }).write({name: 'left', state: {heading: 50}})
})

test('roll command', (assert) => {
  assert.plan(2)
  makeSpheroDrive({
    roll: (speed, heading) => {
      assert.is(speed, 102, 'roll ball according speed as percentage of 255')
      assert.is(heading, 50, 'roll ball according to state heading')
    }
  }).write({name: 'roll', state: {heading: 50, speed: 0.4}})
})

test('stop command', (assert) => {
  assert.plan(1)
  makeSpheroDrive({
    roll: (speed, heading) => {
      assert.is(speed, 0, 'set speed to 0')
    }
  }).write({name: 'stop', state: {heading: 50}})
})

test('die command', (assert) => {
  assert.plan(1)
  makeSpheroDrive({
    halt: () => {
      assert.ok(true, 'send halt instruction')
    }
  }).write({name: 'die'})
})

test('passes all cmds through stream', (assert) => {
  const mockBall = {}
  mockBall.randomColor = mockBall.configureLocator = 
  mockBall.setBackLed = mockBall.roll = mockBall.halt = function () {
    [].slice.call(arguments)
      .filter(a => typeof a === 'function')
      .forEach(fn => fn())
  }
  const stream = () => makeSpheroDrive(mockBall)

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