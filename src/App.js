import React from 'react'
import './App.css'
import BarChart from './BarChart'
import TimeBarChart from './TimeBarChart'
import TimeStackedBarChart from './TimeStackedBarChart'

const data = [
    { year: 2015, efficiency: 37.2, sales: 15517000 },
    { year: 2016, efficiency: 37.7, sales: 16873000 },
    { year: 2017, efficiency: 39.4, sales: 16873000 }
]

const tsData = [
    { ts: 1583884800979, sales: 100 },
    { ts: 1581465600979, sales: 300 },
    { ts: 1591920000979, sales: 900 }
]

const tsDataStacked = [
    { ts: 1583884800979, apples: 100, oranges: 200 },
    { ts: 1581465600979, apples: 200, oranges: 700 },
    { ts: 1591920000979, apples: 300, oranges: 1000 }
]

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <TimeStackedBarChart data={tsDataStacked} />
                {/* <TimeBarChart data={tsData} />
                <BarChart data={data} /> */}
            </header>
        </div>
    )
}

export default App
