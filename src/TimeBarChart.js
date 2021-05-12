import { useD3 } from './hooks/useD3'
import React from 'react'
import * as d3 from 'd3'

function BarChart({ data }) {
    const ref = useD3(
        svg => {
            const height = 500
            const width = 500
            const margin = { top: 20, right: 30, bottom: 30, left: 40 }

            // timeXScale = scaleTime()
            // .domain([Math.min(...times) - scales.xTime.adjust, Math.max(...times) + scales.xTime.adjust])
            // .range([0, width])
            const times = data.map(d => d.ts)
            const xScale = d3
                .scaleTime()
                .domain([Math.min(...times), Math.max(...times)])
                .range([0, width])
            console.log(`TODO DELETE ME: xScale.domain()=${JSON.stringify(xScale.domain())}`)

            const y1Scale = d3
                .scaleLinear()
                .domain([0, d3.max(data, d => d.sales)])
                .rangeRound([height - margin.bottom, margin.top])

            const xAxis = g =>
                g.attr('transform', `translate(0,${height - margin.bottom})`).call(
                    d3
                        .axisBottom(xScale)
                        .tickValues(
                            d3.ticks(...d3.extent(xScale.domain()), width / 40).filter(v => xScale(v) !== undefined)
                        )
                        .tickSizeOuter(0)
                )

            const y1Axis = g =>
                g
                    .attr('transform', `translate(${margin.left},0)`)
                    .style('color', 'steelblue')
                    .call(d3.axisLeft(y1Scale).ticks(null, 's'))
                    .call(g => g.select('.domain').remove())
                    .call(g =>
                        g
                            .append('text')
                            .attr('x', -margin.left)
                            .attr('y', 10)
                            .attr('fill', 'currentColor')
                            .attr('text-anchor', 'start')
                            .text(data.y1)
                    )

            svg.select('.x-axis').call(xAxis)
            svg.select('.y-axis').call(y1Axis)

            svg.select('.plot-area')
                .attr('fill', 'steelblue')
                .selectAll('.bar')
                .data(data)
                .join('rect')
                .attr('class', 'bar')
                .attr('x', d => xScale(d.year))
                // .attr('width', xScale.bandwidth())
                .attr('width', '100')
                .attr('y', d => y1Scale(d.sales))
                .attr('height', d => y1Scale(0) - y1Scale(d.sales))

            console.log(`TODO DELETE ME: completed TimeBarChart stuff.`)
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
