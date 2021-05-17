import { useD3 } from './hooks/useD3'
import React from 'react'
import * as d3 from 'd3'
import dayjs from 'dayjs'
import _ from 'lodash'

const BAR_WIDTH = 50
const BAR_WIDTH_HALF = BAR_WIDTH / 2

function getStackMax(keys, data) {
    let max

    for (const d of data) {
        let keySum = 0
        for (const k of keys) {
            const keyValue = d[k] || 0
            keySum += keyValue
        }

        if (_.isNil(max) || keySum > max) {
            max = keySum
        }
    }

    return max
}

function TimeStackedBarChart({ data }) {
    const ref = useD3(
        svg => {
            const height = 500
            const width = 750
            const margin = { top: 20, right: 30, bottom: 30, left: 40 }

            const keys = ['oranges', 'apples']
            const stackGen = d3.stack().keys(keys)
            const dataStack = stackGen(data)
            const scaleColor = d3.scaleOrdinal().domain(keys).range(d3.schemeCategory10)

            const times = data.map(d => d.ts)
            const xScale = d3
                .scaleTime()
                .domain([Math.min(...times), Math.max(...times)])
                .range([margin.left + BAR_WIDTH + 1, width - BAR_WIDTH])

            const y1Scale = d3
                .scaleLinear()
                .domain([0, getStackMax(keys, data)])
                .rangeRound([height - margin.bottom, margin.top])

            const xAxis = g =>
                g
                    .attr('transform', `translate(0,${height - margin.bottom})`)
                    .style('color', 'red')
                    .call(
                        d3
                            .axisBottom(xScale)
                            .tickValues(times)
                            .tickFormat(d => {
                                return dayjs(d).format('YYYY-MM-DD:HH:mm:ss')
                            })
                    )

            const y1Axis = g =>
                g
                    .attr('transform', `translate(${margin.left},0)`)
                    .style('color', 'green')
                    .call(d3.axisLeft(y1Scale).ticks(null, 's'))
                    .call(g =>
                        g
                            .append('text')
                            .attr('x', -margin.left)
                            .attr('y', margin.top / 2)
                            .attr('fill', 'currentColor')
                            .attr('text-anchor', 'start')
                            .text('Y some title')
                    )

            const y2Axis = g =>
                g
                    .attr('transform', `translate(${width},0)`)
                    .style('color', 'orange')
                    .call(d3.axisRight(y1Scale).ticks(null, 's'))
                    .call(g =>
                        g
                            .append('text')
                            .attr('x', -margin.right)
                            .attr('y', margin.top / 2)
                            .attr('fill', 'currentColor')
                            .attr('text-anchor', 'start')
                            .text('Y2 some title')
                    )

            svg.select('.x-axis').call(xAxis)
            svg.select('.y-axis').call(y1Axis)
            svg.select('.y2-axis').call(y2Axis)

            const tooltip = d3
                .select(document.body)
                .append('div')
                .attr('class', 'barTooltip')
                .style('opacity', 0)
                .style('position', 'absolute')
                .style('background-color', 'lightblue')

            svg.select('.plot-area')
                .selectAll('g.series')
                .data(dataStack)
                .join('g')
                .classed('series', true)
                .style('fill', d => {
                    return scaleColor(d.key)
                })
                .call(g => {
                    g.selectAll('rect') //For each of the new g.series, add the stacks of a bar
                        .data(d => d)
                        .join('rect')
                        .attr('width', BAR_WIDTH)
                        .attr('y', (d, i) => {
                            return y1Scale(d[1])
                        })
                        .attr('x', d => {
                            let xPosition = xScale(d.data.ts) - BAR_WIDTH_HALF
                            if (d.data.adjustXAxis) {
                                xPosition = xPosition + d.data.adjustXAxis
                            }
                            console.log(`TODO DELETE ME: xPosition=${xPosition}`)
                            console.log(`TODO DELETE ME: d.data=${JSON.stringify(d.data)}`)

                            return xPosition
                        }) //Half of the bar width will center the bar
                        .attr('height', d => y1Scale(d[0]) - y1Scale(d[1]))
                        .on('click', function () {
                            const datum = d3.select(this).datum()
                            // const parentData = d3.select(this.parentNode).datum()
                            console.log(`TODO DELETE ME: datum.data.ts=${JSON.stringify(datum.data.ts)}`)
                        })
                        .on('mousemove', function (event) {
                            console.log(`TODO DELETE ME: MOUSEMOVE`)
                            const datum = d3.select(this).datum()
                            const parentDatum = d3.select(this.parentNode).datum()
                            const width = tooltip.node().getBoundingClientRect().width
                            const left = event.pageX - width / 2 + 'px'
                            const top = event.pageY + 20 + 'px'
                            const toolHtml = [
                                `key: ${parentDatum.key}`,
                                `ts: ${dayjs(datum.data.ts).format('YYYY-MM-DD:HH:mm:ss')}`,
                                `value: ${datum.data[parentDatum.key]}`
                            ].join('<br>')

                            tooltip.style('left', left).style('top', top).html(toolHtml)
                        })
                        .on('mouseover', function () {
                            tooltip.style('opacity', 0.9)
                        })
                        .on('mouseout', function () {
                            tooltip.style('opacity', 0)
                        })
                })

            svg.selectAll('.dot')
                .data(data)
                .enter()
                .append('circle')
                .attr('r', 5)
                .attr('cx', d => {
                    return xScale(d.ts)
                })
                .attr('cy', d => {
                    return y1Scale(d.apples)
                })

            svg.selectAll('.dot')
                .data(data)
                .enter()
                .append('circle')
                .attr('r', 5)
                .attr('cx', d => {
                    return xScale(d.ts)
                })
                .attr('cy', d => {
                    return y1Scale(d.oranges)
                })

            console.log(`TODO DELETE ME: completed TimeStackedBarChart stuff.`)
        },
        [data.length]
    )

    return (
        <svg
            ref={ref}
            style={{
                height: 500,
                width: '100%',
                marginRight: '0px',
                marginLeft: '5px',
                borderColor: 'blue',
                borderWidth: '1px',
                borderStyle: 'solid'
            }}
        >
            <g className="plot-area" />
            <g className="x-axis" />
            <g className="y-axis" />
            <g className="y2-axis" />
        </svg>
    )
}

export default TimeStackedBarChart
