'use strict'
const test = require('tap').test
const locprinter = require('./')
const through = require('through2')

test('stops status bar when command name is "die"', (assert) => {
  const write = process.stdout.write
  process.stdout.write = (s) => {
    if (/node-status/.test(Error().stack)) { return }
    write.call(process.stdout, s)
  }
  assert.tearDown(() => {
    process.stdout.write = write
  })

  var stream = locprinter()
  setImmediate(() => {
    const handleCount = process._getActiveHandles().length
    stream.write({name: 'die'})
    setImmediate(() => {
      assert.is(process._getActiveHandles().length, handleCount - 2)
      assert.end()
    })
  })
})


test('updates status bar text when command name is "loc"', (assert) => {
  const write = process.stdout.write
  process.stdout.write = (s) => {
    if (/node-status/.test(Error().stack)) { return }
    write.call(process.stdout, s)
  }
  assert.tearDown(() => {
    setImmediate(() => {
      stream.write({name: 'die'})
      process.stdout.write = write
    })
  })

  const stream = locprinter()
  
  stream.write({
    name: 'loc', 
    x: 5, 
    y: 10
  })

  assert.equal('x:5 y:10', stream.location.text)

  stream.write({
    name: 'loc', 
    x: 15, 
    y: 20
  })

  assert.equal('x:15 y:20', stream.location.text)
  assert.end()

})