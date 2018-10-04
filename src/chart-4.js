import * as d3 from 'd3'

// I'll give you margins/height/width
var margin = { top: 100, left: 10, right: 10, bottom: 30 }
var height = 500 - margin.top - margin.bottom
var width = 400 - margin.left - margin.right

// And grabbing your container
var container = d3.select('#chart-4')

// Create your scales

var xPositionScale = d3
  .scaleLinear()
  .domain([-6, 6])
  .range([0, width])

var yPositionScale = d3.scaleLinear().range([height, 0])

// Create your area generator

// Read in your data, then call ready

d3.tsv(require('./climate-data.tsv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

// Write your ready function

function ready(datapoints) {
  console.log('Data is', datapoints)

  var frequencies = datapoints.map(function(d) {
    return +d.freq
  })
  yPositionScale.domain(frequencies)

  var filtered = datapoints.filter(function(d) {
    return d.year >= 1951 && d.year < 1980
  })
  console.log('Data is', filtered)

  // svg for first graph

  // container
  //   .selectAll('.svg1951')
  //   .data(filtered)
  //   .enter()
  //   .append('svg')
  //   .attr('class', 'svg1951')
  //    .attr('height', height + margin.top + margin.bottom)
  //    .attr('width', width + margin.left + margin.right)
  //    .append('g')
  //   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // build your axis

  var xAxis = d3
    .axisBottom(xPositionScale)
    .tickValues(['Extremely cold', 'Cold', 'Normal', 'Hot', 'Extremely Hot'])
  container
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
  var yAxis = d3.axisLeft(yPositionScale).ticks(0)
  // .tickValues([0.3, 0.2, 0.1, 0.0]) doesn't work

  container
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
