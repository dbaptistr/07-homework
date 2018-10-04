import * as d3 from 'd3'

// Create your margins and height/width
var margin = { top: 80, left: 50, right: 20, bottom: 20 }

var height = 250 - margin.top - margin.bottom

var width = 200 - margin.left - margin.right

// I'll give you this part!
var container = d3.select('#chart-3')

// Create your scales

var xPositionScale = d3
  .scaleLinear()
  .domain([1980, 2010])
  .range([0, width])
var yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])

// Create your line generator

var line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.year)
  })
  .y(function(d) {
    return yPositionScale(+d.income)
  })

var lineUsa = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.year)
  })
  .y(function(d) {
    return yPositionScale(+d.income)
  })

// Read in your data

Promise.all([
  d3.csv(require('./middle-class-income.csv')),
  d3.csv(require('./middle-class-income-usa.csv'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Create your ready function
function ready([datapointsOthers, datapointsUSA]) {
  console.log(datapointsOthers)

  var nested = d3
    .nest()
    .key(function(d) {
      return d.country
    })
    .entries(datapointsOthers)

  // Add your lines

  container
    .selectAll('.income-graph')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'income-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      var svg = d3.select(this)
      console.log(d)
      svg
        .append('path')
        .datum(d.values)
        .attr('stroke-width', 2)
        .attr('stroke', '#9e4b6c')
        .attr('d', line)
        .attr('fill', 'none')

      svg
        .append('path')
        .datum(datapointsUSA)
        .attr('d', lineUsa)
        .attr('stroke', 'grey')
        .attr('fill', 'none')

      svg
        .append('text')
        .text('USA')
        .attr('y', 20)
        .attr('x', 10)
        .attr('font-size', '10px')
        .attr('fill', 'grey')

      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 0) // it's zero up at the top
        .attr('text-anchor', 'middle') // anchors the text in the x middle, instead of it starting in the middle
        .attr('dy', -10)
        .attr('font-size', '10px')
        .style('font-weight', 'bold')
        .attr('fill', '#9e4b6c')

      /* Add in your axes */

      const xAxis = d3
        .axisBottom(xPositionScale)
        .ticks(4)
        .tickFormat(d3.format('d'))
        .tickSize(-height)

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      d3.selectAll('.x-axis line')
        .attr('stroke-dasharray', '2 5')
        .attr('line-linecap', 'round')

      // svg.selectAll('.x-axis path').remove()

      const yAxis = d3
        .axisLeft(yPositionScale)
        .ticks(4)
        .tickFormat(d3.format('$,d'))
        .tickValues([20000, 15000, 10000, 5000])
        .tickSize(-width)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
      d3.selectAll('.y-axis line')
        .attr('stroke-dasharray', '2 2')
        .attr('line-linecap', 'round')

      svg.select('.axis').lower()

      svg.selectAll('.domain').remove()
    })
}

export { xPositionScale, yPositionScale, width, height, line, lineUsa }
