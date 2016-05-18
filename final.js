'use strict'

const nd = require('ndjson')
const pump = require('pump')
const once = require('once')
let cylon = require('cylon')
const keypresser = require('./controller/keypresser')
const gamepad = require('./controller/gamepad')
const keyparser = require('./controller/keyparser')
const gamepadParser = require('./controller/gamepadParser')
const killer = require('./controller/killer')
const locprinter = require('./controller/locprinter')
const controller = require('./controller/controller')
const client = require('./controller/client')
const spheroDrive = require('./controller/spheroDrive')
const spheroEvents = require('./controller/spheroEvents')

function connect() {
  cylon
    .robot()
    .connection('joystick', {adaptor: 'joystick-node-4-and-5'})
    .device('controller', {driver: 'joystick', config: __dirname + '/nes.json'})
    .on('ready', (bot) => {
      const controller = bot.controller
      cylon
        .robot()
        .connection('sphero', {adaptor: 'sphero', port: process.argv[2]})
        .device('sphero', {driver: 'sphero'})
        .on('ready', (bot) => {
          bot.controller = controller
          ready(bot)
        })
        .start()
    })

  cylon.start()
}

connect()
usage = once(usage)

function ready(bot) {
  const ball = bot.sphero
  const ctrl = controller()
  const serialize = nd.serialize()
  const kp = keypresser()
  const eos = once(() => {
    setImmediate(() => {
      console.log('Pipeline ended, tearing down..')
      cylon.halt()
      delete require.cache[require.resolve('cylon-sphero')]
      console.log('Waiting 5s for serial port clean up')
      //TODO figure out how to re-init serial port
      setTimeout(() => {
        console.log('Attempting to reconnect')
        connect()  
      }, 5000)
    })
  })

  usage()
  setup(ball)

  pump(
    kp,
    keyparser(),
    spheroEvents(ball),
    ctrl,
    killer(),
    spheroDrive(ball),
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

function setup(ball) {
  ball.setStabilization(1, handle)

  ball.configureLocator({
    flags: 0x01,
    x: 0,
    y: 0,
    yawTare: 0
  }, handle)

  ball.setDataStreaming({
    n: 200,
    m: 1,
    pcnt: 0,
    dataSources: ['odometer']
  }, handle)

  ball.setBackLed(255)
  ball.randomColor(handle)     

  ball.setRotationRate(255, handle)  
}

function handle(err) {
  if (err) { 
    if (/sync response was lost/.test(err.message)) {
      console.log('Out of sync')
      return
    }
    process.exit(!console.trace(err))
  }  
}

function usage() {
  console.log('Connected!')
  console.log('  c - change color and reset location')
  console.log('  b - backled on/off')
  console.log('  , - reduce move 1/10th')
  console.log('  . - increase move 1/10th')
  console.log('  up - move forward')
  console.log('  back - stop')
  console.log('  left - change heading 15 deg left')
  console.log('  right - change heading 15 deg right\n\n')
}