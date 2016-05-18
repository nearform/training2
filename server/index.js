'use strict'

const http = require('http')
const net = require('net')
const WebSocketServer = require('ws').Server
const websocket = require('websocket-stream')
const through = require('through2')
const fs = require('fs')

const webServer = http.createServer(function (req, res) {
  if (/index\.html|\/$/i.test(req.url)) {
    fs.createReadStream('./ui/index.html').pipe(res)
    return
  }

  if (/bundle\.js|index\.js/i.test(req.url)) {
    fs.createReadStream('./ui/bundle.js').pipe(res)
    return
  }
  res.statusCode = 404
  res.end()

}).listen(3000)

const wss = new WebSocketServer({server: webServer})
  
const logger = (stream) => through(function(data, enc, cb) {
  console.log(stream + ': ', data + '')
  cb(null, data)
})

net.createServer((socket) => {
  console.log('Connection from controller')
  console.log('Waiting for a WebSocket connection')
  const pipeline = (ws) => {
    console.log('WebSocket connected, setting up pipeline')
    ws = websocket(ws)
    socket.pipe(ws).pipe(socket)
    socket.pipe(logger('socket'))
    ws.pipe(logger('ws'))
  }
  wss.once('connection', pipeline)
  socket.on('close', () => {
    console.log('socket closed')
    wss.removeListener('connection', pipeline)
    wss.close()
  })
}).listen(8124)



