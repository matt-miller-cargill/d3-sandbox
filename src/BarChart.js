import { useD3 } from './hooks/useD3'
import React from 'react'
import * as d3 from 'd3'

function BarChart({ data }) {
    const ref = useD3(
        svg => {
            const height = 500
            const width = 500
            const margin = { top: 20, right: 30, bottom: 30, left: 40 }

            const xScale = d3
                .scaleBand()
                .domain(data.map(d => d.year))
                .rangeRound([margin.left, width - margin.right])
                .padding(0.5)

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
                            .tickValues(
                                d3.ticks(...d3.extent(xScale.domain()), 100).filter(v => xScale(v) !== undefined)
                            )
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
                            .attr('y', 10)
                            .attr('fill', 'currentColor')
                            .attr('text-anchor', 'start')
                            .text('Y some title')
                    )

            svg.select('.x-axis').call(xAxis)
            svg.select('.y-axis').call(y1Axis)

            svg.select('.plot-area')
                .attr('fill', 'purple')
                .selectAll('.bar')
                .data(data)
                .join('rect')
                .attr('class', 'bar')
                .attr('x', d => xScale(d.year))
                .attr('width', () => {
                    return xScale.bandwidth()
                })
                .attr('y', d => y1Scale(d.sales))
                .attr('height', d => {
                    return y1Scale(0) - y1Scale(d.sales)
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
                marginLeft: '0px'
            }}
        >
            <g className="plot-area" />
            <g className="x-axis" />
            <g className="y-axis" />
        </svg>
    )
}

export default BarChart
