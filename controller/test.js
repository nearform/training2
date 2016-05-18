const tap = require('tap')
const fs = require('fs')
const path = require('path')
const Tmr = require('tap-mocha-reporter')

tap.unpipe(process.stdout)
tap.pipe(new Tmr('classic'))

fs.readdirSync(__dirname).forEach((d) => {
  const dir = path.join(__dirname, d)
  if (fs.statSync(dir).isDirectory()) {
    tap.spawn('node', [path.join(dir, 'test.js')], d)
  }
})

