'use strict'
const nd = require('ndjson')
const pump = require('pump')
const once = require('once')
const cylon = require('cylon')
const keypresser = require('./controller/keypresser')
const keyparser = require('./controller/keyparser')
const killer = require('./controller/killer')
const controller = require('./controller/controller')
const client = require('./controller/client')
const locationSim = require('./scaffolding/location-sim')
const gamepad = require('./controller/gamepad')
const gamepadParser = require('./controller/gamepadParser')

cylon
  .robot()
  .connection('joystick', {adaptor: 'joystick-node-4-and-5'})
  .device('controller', {driver: 'joystick', config: __dirname + '/nes.json'})
  .on('ready', ready)
  .start()

function ready(bot) {
  const ctrl = controller()
  const serialize = nd.serialize()
  const kp = keypresser()
  const eos = once(() => setImmediate(ready, bot))

  pump(
    kp,
    keyparser(),
    ctrl,
    locationSim(),
    killer(),
    serialize,
    client(),
    nd.parse(),
    kp,
    eos
  )

  pump(
    gamepad(bot.controller),
    gamepadParser(),
    ctrl,
    eos
  )

  pump(serialize, process.stdout)
}