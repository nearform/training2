'use strict'
const nd = require('ndjson')
const keypresser = require('./controller/keypresser')
const keyparser = require('./controller/keyparser')
const killer = require('./controller/killer')
const controller = require('./controller/controller')
const client = require('./controller/client')
const locationSim = require('./scaffolding/location-sim')

const serialize = nd.serialize()
const kp = keypresser()

kp
  .pipe(keyparser())
  .pipe(controller())
  .pipe(locationSim())
  .pipe(killer())
  .pipe(serialize)
  .pipe(client())
  .pipe(nd.parse())
  .pipe(kp)

serialize.pipe(process.stdout)



