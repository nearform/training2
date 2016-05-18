var key = require('keymaster')
var through = require('through2')
var keystream = through()

function write(k, stream) {
  return function() {
    if (k === '.' || k === ',') {
      stream.write(JSON.stringify({cmd: 'key', ch: k}) + '\n')
      return
    }
    stream.write(JSON.stringify({cmd: 'key', key: {name: k}}) + '\n')
  }
}

key('c', write('c', keystream))
key('b', write('b', keystream))
key('up', write('up', keystream))
key('down', write('down', keystream))
key('left', write('left', keystream))
key('right', write('right', keystream))
key('q', write('q', keystream))
key('.', write('.', keystream))
key(',', write(',', keystream))

module.exports = keystream