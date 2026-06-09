import { Routes, Route } from 'react-router-dom'
import { useAccount } from 'wagmi'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Markets from './pages/Markets'
import Portfolio from './pages/Portfolio'
import Liquidate from './pages/Liquidate'
import Governance from './pages/Governance'
import Landing from './pages/Landing'

function App() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return <Landing />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/liquidate" element={<Liquidate />} />
        <Route path="/governance" element={<Governance />} />
      </Routes>
    </Layout>
  )
}

export default App

