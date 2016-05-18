var logger = require('./logger')(document.getElementById('logger'))
var keystream = require('./keystream')
var graphStream = require('./graphStream')
var split = require('split2')
var ws = require('websocket-stream')('ws://localhost:3000', [])

ws.pipe(split()).pipe(logger)
ws.pipe(split()).pipe(graphStream)

keystream.pipe(ws)