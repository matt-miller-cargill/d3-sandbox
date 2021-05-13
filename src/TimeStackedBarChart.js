import { useD3 } from './hooks/useD3'
import React from 'react'
import * as d3 from 'd3'
import dayjs from 'dayjs'
import _ from 'lodash'

const BAR_WIDTH = 75
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
            const width = 1000
            const margin = { top: 20, right: 30, bottom: 30, left: 40 }

            const keys = ['oranges', 'apples']
            // console.log(`data=${JSON.stringify(data)}`)
            // [
            //     { ts: 1583884800979, apples: 100, oranges: 200 },
            //     { ts: 1581465600979, apples: 300, oranges: 600 },
            //     { ts: 1591920000979, apples: 500, oranges: 1000 }
            // ]

            const stackGen = d3.stack().keys(keys)
            const dataStack = stackGen(data)
            // console.log(`TODO DELETE ME: dataStack=${JSON.stringify(dataStack)}`)
            // [
            //     [
            //         [0, 100],
            //         [0, 300],
            //         [0, 500]
            //     ],
            //     [
            //         [100, 300],
            //         [300, 900],
            //         [500, 1500]
            //     ]
            // ]

            const scaleColor = d3.scaleOrdinal().domain(keys).range(d3.schemeCategory10)

            const times = data.map(d => d.ts)
            const xScale = d3
                .scaleTime()
                .domain([Math.min(...times), Math.max(...times)])
                .range([margin.left + BAR_WIDTH_HALF, width - BAR_WIDTH_HALF])

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

            const sel = svg
                .select('.plot-area')
                .selectAll('g.series')
                .data(dataStack)
                .join('g')
                .classed('series', true)
                .style('fill', d => scaleColor(d.key))
                .call(g => {
                    //For each of the new g.series, add the stacks of a bar
                    g.selectAll('rect')
                        .data(d => d)
                        .join('rect')
                        .attr('width', BAR_WIDTH)
                        .attr('y', d => {
                            console.log(`TODO DELETE ME: draw-stack d=${JSON.stringify(d)}`)
                            return y1Scale(d[1])
                        })
                        .attr('x', d => xScale(d.data.ts) - BAR_WIDTH_HALF) //Half of the bar width will center the bar
                        .attr('height', d => y1Scale(d[0]) - y1Scale(d[1]))
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
