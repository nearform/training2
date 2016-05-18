"use strict";

var through = require('through2')

function makeLogger(el) {
  var logger = through(function(data, enc, next) {
    el.innerHTML = data + '<br>' + el.innerHTML 
    next()
  })

  return logger
}

module.exports = makeLogger