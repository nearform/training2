'use strict'
const nd = require('ndjson')
const keypresser = require('./controller/keypresser')
const keyparser = require('./controller/keyparser')
const killer = require('./controller/killer')
const controller = require('./controller/controller')

keypresser()
  .pipe(keyparser())
  .pipe(controller())
  .pipe(killer())
  .pipe(nd.serialize())
  .pipe(process.stdout)

