var fabric = require('fabric').fabric
var through = require('through2')

var canvas = new fabric.Canvas('tracker', {selection: false})

var size = 600

var state = {
  last: [(size / 2), (size / 2)]
}

var triangle = new fabric.Triangle({
  width: 20,
  height: 30,
  fill: '#00f',
  left: (size / 2),
  top: (size / 2),
  originX: 'center',
  originY: 'center'
})

canvas.add(triangle)


function makeLine(coords) {
  return new fabric.Line(coords, {
    fill: 'red',
    stroke: 'red',
    strokeWidth: 5,
    originX: 'center',
    originY: 'center'
  })
}

var graphStream = through(function(data, enc, next) {
  try {
    data = JSON.parse(data)
  } catch (e) {
    console.log(e, '' + data)
    data = {}
  }

  if (data.name === 'loc') {
    var x = (size / 2) + data.x
    var y = (size / 2) + (-1 * data.y)

    canvas.add(makeLine(state.last.concat([x, y])))

    triangle.set({
      left: x,
      top: y,
      angle: data.state.heading,
      fill: data.state.backled ? '#00f' : '#008'
    }).bringToFront()

    canvas.renderAll()

    state.last = [x, y]
  } else if (data.name === 'reset') {
    canvas.clear()

    triangle.set({
      left: (size / 2),
      top: (size / 2),
      angle: data.state.heading,
      fill: data.state.backled ? '#00f' : '#008'
    }).bringToFront()

    canvas.renderAll()

    state.last = [(size / 2), (size / 2)]
  }

  next()
})

module.exports = graphStream
