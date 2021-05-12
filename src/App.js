import React from 'react'
import './App.css'
import BarChart from './BarChart'
import TimeBarChart from './TimeBarChart'

const data = [
    { year: 2015, efficiency: 37.2, sales: 15517000 },
    { year: 2016, efficiency: 37.7, sales: 16873000 },
    { year: 2017, efficiency: 39.4, sales: 16873000 }
]

const tsData = [
    { ts: 1620854999979, sales: 100 },
    { ts: 1618262999979, sales: 300 },
    { ts: 1615584599979, sales: 900 }
]

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <BarChart data={data} />
                {/* <TimeBarChart data={tsData} /> */}
            </header>
        </div>
    )
}

export default App
