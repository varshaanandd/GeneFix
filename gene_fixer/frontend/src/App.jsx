import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from '../pages/Home'
import GetGene from '../pages/GetGene'
import Result from '../pages/Result'
import NotFound from '../pages/NotFound'
import NavBar from '../components/NavBar'
import SimulateResult from '../pages/SimulateResult'
import Live_Simulate from '../pages/Live_Simulate'

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gene-fix" element={<GetGene />} />
        <Route path="/simulate" element={<SimulateResult />} />
        <Route path="/live-simulate" element={<Live_Simulate />} />
        <Route path="/result" element={<Result />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
