'use strict'
const nd = require('ndjson')
const pump = require('pump')
const keypresser = require('./controller/keypresser')
const keyparser = require('./controller/keyparser')
const killer = require('./controller/killer')
const controller = require('./controller/controller')
const client = require('./controller/client')
const locationSim = require('./scaffolding/location-sim')

ready()

function ready() {
  const serialize = nd.serialize()
  const kp = keypresser()
  pump(
    kp,
    keyparser(),
    controller(),
    locationSim(),
    killer(),
    serialize,
    client(),
    nd.parse(),
    kp,
    () => setImmediate(ready)
  )
  
  pump(serialize, process.stdout)
}

