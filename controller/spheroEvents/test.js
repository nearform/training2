'use strict'
const test = require('tap').test
const makeSpheroEvents = require('./')
const EventEmitter = require('events')
const through = require('through2').obj

test('spheroEvents stream', (assert) => {

  const mockBall = new EventEmitter
  const spheroEvents = makeSpheroEvents(mockBall)

  const tester = through((cmd, enc, cb) => {
    assert.is(cmd.name, 'loc')
    assert.is(cmd.x, 100)
    assert.is(cmd.y, 200)
    assert.end()
    cb()
  })

  mockBall.emit('dataStreaming', {
    xOdometer: {value: [100]},
    yOdometer: {value: [200]}
  })

  spheroEvents.pipe(tester)

})