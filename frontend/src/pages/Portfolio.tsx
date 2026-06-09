import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, PiggyBank, ArrowUpRight, ArrowDownRight, AlertTriangle } from 'lucide-react'
import HealthBar from '../components/HealthBar'

interface Position {
  type: 'supply' | 'borrow'
  asset: string
  amount: string
  value: string
  apy: number
  logo: string
}

const positions: Position[] = [
  { type: 'supply', asset: 'WETH', amount: '5.0', value: '$17,500.00', apy: 3.24, logo: 'Ξ' },
  { type: 'supply', asset: 'USDC', amount: '15,000.0', value: '$15,000.00', apy: 4.12, logo: '$' },
  { type: 'supply', asset: 'WBTC', amount: '0.2', value: '$13,000.00', apy: 2.89, logo: '₿' },
  { type: 'borrow', asset: 'USDC', amount: '8,000.0', value: '$8,000.00', apy: 6.89, logo: '$' },
  { type: 'borrow', asset: 'DAI', amount: '4,450.0', value: '$4,450.00', apy: 6.12, logo: '◈' },
]

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<'all' | 'supply' | 'borrow'>('all')

  const filteredPositions = positions.filter(p => activeTab === 'all' || p.type === activeTab)

  const totalSupplied = positions
    .filter(p => p.type === 'supply')
    .reduce((acc, p) => acc + parseFloat(p.value.replace(/[$,]/g, '')), 0)

  const totalBorrowed = positions
    .filter(p => p.type === 'borrow')
    .reduce((acc, p) => acc + parseFloat(p.value.replace(/[$,]/g, '')), 0)

  const netAPY = positions.reduce((acc, p) => {
    const value = parseFloat(p.value.replace(/[$,]/g, ''))
    return acc + (p.type === 'supply' ? value * p.apy / 100 : -value * p.apy / 100)
  }, 0) / (totalSupplied + totalBorrowed) * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Portfolio</h1>
        <p className="text-dark-400 mt-1">Manage your lending positions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <PiggyBank className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-dark-400 text-sm">Total Supplied</span>
          </div>
          <p className="text-2xl font-bold text-white">${totalSupplied.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-dark-400 text-sm">Total Borrowed</span>
          </div>
          <p className="text-2xl font-bold text-white">${totalBorrowed.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-proton-500/10">
              <Wallet className="w-5 h-5 text-proton-400" />
            </div>
            <span className="text-dark-400 text-sm">Net APY</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">+{netAPY.toFixed(2)}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-indigo-500/10">
              <ArrowUpRight className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-dark-400 text-sm">Available to Borrow</span>
          </div>
          <p className="text-2xl font-bold text-white">$21,500.00</p>
        </motion.div>
      </div>

      {/* Health Bar */}
      <HealthBar
        healthFactor={78.5}
        collateralValue={`$${totalSupplied.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        borrowValue={`$${totalBorrowed.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
      />

      {/* Positions */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-dark-800/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Your Positions</h3>
              <p className="text-sm text-dark-400">Active supply and borrow positions</p>
            </div>
            <div className="flex items-center bg-dark-800 rounded-xl p-1">
              {(['all', 'supply', 'borrow'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === type
                      ? 'bg-proton-500 text-white'
                      : 'text-dark-400 hover:text-white'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-dark-800/30">
          {filteredPositions.map((position, index) => (
            <motion.div
              key={`${position.type}-${position.asset}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-6 hover:bg-dark-800/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                  position.type === 'supply' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                }`}>
                  {position.logo}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{position.asset}</p>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      position.type === 'supply' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-orange-500/10 text-orange-400'
                    }`}>
                      {position.type === 'supply' ? 'Supplying' : 'Borrowing'}
                    </span>
                  </div>
                  <p className="text-sm text-dark-400">{position.amount} {position.asset}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="font-semibold text-white">{position.value}</p>
                  <p className="text-sm text-dark-400">Value</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${position.type === 'supply' ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {position.type === 'supply' ? '+' : '-'}{position.apy.toFixed(2)}%
                  </p>
                  <p className="text-sm text-dark-400">APY</p>
                </div>
                <div className="flex items-center gap-2">
                  {position.type === 'supply' ? (
                    <>
                      <button className="px-4 py-2 bg-dark-800 text-white text-sm font-medium rounded-lg 
                                       hover:bg-dark-700 transition-colors border border-dark-700">
                        Withdraw
                      </button>
                      <button className="px-4 py-2 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-lg 
                                       hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                        Supply More
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="px-4 py-2 bg-dark-800 text-white text-sm font-medium rounded-lg 
                                       hover:bg-dark-700 transition-colors border border-dark-700">
                        Repay
                      </button>
                      <button className="px-4 py-2 bg-orange-500/10 text-orange-400 text-sm font-medium rounded-lg 
                                       hover:bg-orange-500/20 transition-colors border border-orange-500/20">
                        Borrow More
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPositions.length === 0 && (
          <div className="text-center py-16">
            <Wallet className="w-12 h-12 text-dark-600 mx-auto mb-4" />
            <p className="text-dark-400">No positions found</p>
            <button className="mt-4 btn-primary">Start Supplying</button>
          </div>
        )}
      </div>
    </div>
  )
}
