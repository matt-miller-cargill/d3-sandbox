import React from 'react'
import * as d3 from 'd3'

export const useD3 = (renderChartFn, dependencies) => {
    console.log(`TODO DELETE ME: RAN useD3 hook.`)
    const ref = React.useRef()

    React.useEffect(() => {
        renderChartFn(d3.select(ref.current))
        return () => {}
    }, dependencies)
    return ref
}
