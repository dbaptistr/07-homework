import * as d3 from 'd3'

// Set up margin/height/width
var margin = { top: 80, left: 30, right: 20, bottom: 20 }

var height = 180 - margin.top - margin.bottom

var width = 95 - margin.left - margin.right

// I'll give you the container
var container = d3.select('#chart-2')

// Create your scales
var xPositionScale = d3
  .scaleLinear()
  .domain([10, 60])
  .range([0, width])
var yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

// Create a d3.line function that uses your scales
var line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y(function(d) {
    return yPositionScale(d.ASFR_jp)
  })

var line2 = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y(function(d) {
    return yPositionScale(d.ASFR_us)
  })

// Read in your data
d3.csv(require('./fertility.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Build your ready function that draws lines, axes, etc
function ready(datapoints) {
  var nested = d3
    .nest()
    .key(function(d) {
      return d.Year
    })
    .entries(datapoints)

  container
    .selectAll('.temp-graph')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'temp-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      var svg = d3.select(this)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', line)
        .attr('stroke', 'none')
        .attr('fill', 'red')
        .attr('opacity', 0.8)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', line2)
        .attr('stroke', 'none')
        .attr('fill', '#41b6c4')
        .attr('opacity', 0.8)
        .lower()

      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 0) // it's zero up at the top
        .attr('text-anchor', 'middle') // anchors the text in the x middle, instead of it starting in the middle
        .attr('dy', -10)
        .attr('font-size', '10px')
        .style('font-weight', 'bold')

      var jpRates = datapoints.map(d => +d.ASFR_jp)
      var usaRates = datapoints.map(d => +d.ASFR_us)

      svg
        .append('text')
        .text(d3.sum(jpRates))
        .attr('x', 40)
        .attr('y', 40)
        .attr('font-size', '9px')
        .attr('fill', 'red')

      svg
        .append('text')
        .text(d3.sum(usaRates))
        .attr('x', 20)
        .attr('y', 20)
        .attr('font-size', '9px')
        .attr('fill', '#41b6c4')

      var xAxis = d3.axisBottom(xPositionScale).tickValues([15, 30, 45])
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
      var yAxis = d3.axisLeft(yPositionScale).ticks(4)
      // .tickValues([0.3, 0.2, 0.1, 0.0]) doesn't work

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
    })
}
