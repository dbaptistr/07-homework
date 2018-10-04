import * as d3 from 'd3'

// Set up margin/height/width
var margin = { top: 30, left: 50, right: 100, bottom: 30 }

var height = 600 - margin.top - margin.bottom
var width = 550 - margin.left - margin.right

// Add your svg
var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

// Create a time parser (see hints)
let parseTime = d3.timeParse('%B-%y')

// Create your scales
var xPositionScale = d3.scaleLinear().range([0, width])

var yPositionScale = d3.scaleLinear().range([height, 0])

var colorScale = d3
  .scaleOrdinal()
  .range([
    '#1f78b4',
    '#fdbf6f',
    '#a6cee3',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a'
  ])

// Create a d3.line function that uses your scales

var line = d3
  .line()
  .x(d => xPositionScale(d.datetime))
  .y(d => yPositionScale(d.price))

// Read in your housing price data

d3.csv(require('./housing-prices.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

// Write your ready function

function ready(datapoints) {
  // Convert your months to dates

  datapoints.forEach(d => (d.datetime = parseTime(d.month)))

  // Get a list of dates and a list of prices
  var datetimes = datapoints.map(d => d.datetime)
  var prices = datapoints.map(d => +d.price)

  // Group your data together

  var nested = d3
    .nest()
    .key(d => d.region)
    .entries(datapoints)

  console.log(nested)

  // Draw your lines
  yPositionScale.domain(d3.extent(prices))
  xPositionScale.domain(d3.extent(datetimes))

  svg
    .selectAll('.reg-line')
    .data(nested) // because we want ten paths
    .enter()
    .append('path')
    .attr('class', 'reg-line')
    .attr('d', d => line(d.values))
    .attr('stroke', d => colorScale(d.key))
    .attr('stroke-width', 2)
    .attr('fill', 'none')

  // Draw your circles
  svg
    .selectAll('.reg-circle')
    .data(nested) // because we want ten paths
    .enter()
    .append('circle')
    .attr('class', 'reg-circle')
    .attr('cx', d => xPositionScale(d.values[0].datetime))
    .attr('cy', d => yPositionScale(d.values[0].price))
    .attr('r', 3)
    .attr('fill', d => colorScale(d.key))

  // Add your text on the right-hand side
  svg
    .selectAll('.reg-label')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', 'reg-label')
    .attr('x', d => xPositionScale(d.values[0].datetime))
    .attr('y', d => yPositionScale(d.values[0].price))
    .text(d => d.key)
    .attr('font-size', 10)
    .attr('dy', 3)
    .attr('dx', 9)

  // Add your title

  svg
    .append('text')
    .text('U.S housing prices fall in winter')
    .attr('x', width / 2)
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .attr('font-size', 20)

  // Add the shaded rectangle

  svg
    .append('rect')
    .attr('x', d => xPositionScale(parseTime('December-16')))
    .attr('y', 0)
    .attr('height', height)
    .attr('width', (datetimes.length / 10) * 3)
    .attr('opacity', 0.5)
    .attr('fill', 'lightgrey')
    .lower()

  // Add your axes

  var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat('%b %y'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)

  var yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}

export {
  xPositionScale,
  yPositionScale,
  colorScale,
  line,
  width,
  height,
  parseTime
}
