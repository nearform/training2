'use strict'
const through = require('through2').obj
const keypress = require('keypress')
const eos = require('end-of-stream')

process.stdin.setRawMode(true)
process.stdin.resume()
keypress(process.stdin)

module.exports = () => {
    const keypresser = through()

    // listen for the "keypress" event
    process.stdin.on('keypress', pushKey);

    eos(keypresser, function () {
        process.stdin.removeListener('keypress', pushKey);
    })

    function pushKey (ch, key) {
        keypresser.push({key: key, ch: ch});
    }

    return keypresser
}

//tips:

// see http://npm.im/keypress
// push objects onto stream with form {key, ch}
// (literally... `push`)
// use http://npm.im/end-of-stream to determine
// when stream has closed (for cleanup)