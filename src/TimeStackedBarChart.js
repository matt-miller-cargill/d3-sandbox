import { useD3 } from './hooks/useD3'
import React from 'react'
import * as d3 from 'd3'
import dayjs from 'dayjs'

const BAR_WIDTH = 75
const BAR_WIDTH_HALF = BAR_WIDTH / 2

function TimeStackedBarChart({ data }) {
    const ref = useD3(
        svg => {
            const height = 500
            const width = 1000
            // const margin = { top: 20, right: 30, bottom: 30, left: 40 }
            const margin = { top: 50, right: 50, bottom: 50, left: 50 }

            // const xScale = d3
            //     .scaleBand()
            //     .domain(data.map(d => d.year))
            //     .rangeRound([margin.left, width - margin.right])
            //     .padding(0.1)

            const times = data.map(d => d.ts)
            const xScale = d3
                .scaleTime()
                .domain([Math.min(...times), Math.max(...times)])
                .range([margin.left + BAR_WIDTH_HALF, width - BAR_WIDTH_HALF])

            console.log(`TODO DELETE ME: d3.extent(times)=${JSON.stringify(d3.extent(times))}`)
            console.log(`TODO DELETE ME: xScale.domain()=${xScale.domain()}`)
            console.log(`TODO DELETE ME: xScale.range()=${xScale.range()}`)

            const y1Scale = d3
                .scaleLinear()
                .domain([0, d3.max(data, d => d.sales)])
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

            svg.select('.plot-area')
                .attr('fill', 'purple')
                .selectAll('.bar')
                .data(data)
                .join('rect')
                .attr('class', 'bar')
                .attr('x', d => {
                    return xScale(d.ts) - BAR_WIDTH / 2
                })
                .attr('width', () => {
                    // return xScale.bandwidth()
                    return BAR_WIDTH
                })
                .attr('y', d => y1Scale(d.sales))
                .attr('height', d => {
                    return y1Scale(0) - y1Scale(d.sales)
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
                    return y1Scale(d.sales)
                })

            console.log(`TODO DELETE ME: completed BarChart stuff.`)
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
