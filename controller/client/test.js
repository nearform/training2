'use strict'
const test = require('tap').test
const net = require('net')
const client = require('./')
const through = require('through2').obj

test('exposes tcp client as `client` on returned stream', (assert) => {
  const connection = client(8123)

  assert.ok(connection.client)

  const server = net.createServer((socket) => {
    socket.end()
    connection.client.disconnect()
    connection.end()
    server.close()
    assert.end()
  }).listen(8123)
})

test('creates TCP socket that connects to default port 8124', (assert) => {
  const connection = client()
  connection.client.reconnect = false
  const server = net.createServer((socket) => {
    assert.ok(true, 'evidence of connection')
    assert.end()

    server.close()
    server.unref()
    socket.end()
  }).listen(8124)
})

test('retries on connection failure', (assert) => {
  const connection = client(8126)
  let count = 0
  const server = net.createServer((socket) => {
    if (!count) {
      count += 1
      socket.end()
      return
    }

    assert.equal(count, 1, 'evidence of retry')
    assert.end()

    server.close()
    server.unref()
    socket.end()
    connection.client.disconnect()
  }).listen(8126)
})

test('displays helpful message when ECONNREFUSED', (assert) => {
 const connection = client(8127)
 const errlog = console.error
 const server = net.createServer((socket) => socket.end()).listen(8127)

 console.error = (s) => {
  assert.is(s, '8127 not open, is server running?')
  console.error = () => {}
  server.close()
  connection.client.disconnect()
  setTimeout(() => {
    console.error = errlog
    assert.end()
  }, 10)
 }

 connection.client.emit('error', {
  code: 'ECONNREFUSED',
  port: 8127
 })
})
