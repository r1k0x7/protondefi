import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, AlertTriangle, Shield, ArrowRight, Info } from 'lucide-react'

interface LiquidatableAccount {
  address: string
  healthFactor: number
  collateralValue: string
  borrowValue: string
  collateralAssets: string[]
  borrowAssets: string[]
  liquidationBonus: string
}

const liquidatableAccounts: LiquidatableAccount[] = [
  {
    address: '0x7a2...3f9b',
    healthFactor: 15,
    collateralValue: '$45,230',
    borrowValue: '$42,100',
    collateralAssets: ['WETH', 'WBTC'],
    borrowAssets: ['USDC', 'DAI'],
    liquidationBonus: '8%',
  },
  {
    address: '0x9c4...8e2a',
    healthFactor: 22,
    collateralValue: '$12,500',
    borrowValue: '$11,800',
    collateralAssets: ['WETH'],
    borrowAssets: ['USDC'],
    liquidationBonus: '8%',
  },
  {
    address: '0x3f1...7d4c',
    healthFactor: 28,
    collateralValue: '$89,000',
    borrowValue: '$82,500',
    collateralAssets: ['WETH', 'WBTC', 'USDC'],
    borrowAssets: ['USDC', 'DAI', 'USDT'],
    liquidationBonus: '8%',
  },
]

export default function Liquidate() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAccounts = liquidatableAccounts.filter(acc =>
    acc.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Liquidation</h1>
          <p className="text-dark-400 mt-1">Liquidate undercollateralized accounts and earn bonuses</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            type="text"
            placeholder="Search by address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 w-80"
          />
        </div>
      </div>

      {/* Info Banner */}
      <div className="glass-card p-6 border-l-4 border-yellow-500">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <Info className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">How Liquidation Works</h3>
            <p className="text-dark-400 text-sm leading-relaxed">
              When a borrower's health factor drops below the liquidation threshold, anyone can repay a portion 
              of their debt and seize an equivalent amount of collateral plus an 8% liquidation bonus. 
              This helps maintain the solvency of the protocol.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-dark-400 text-sm">Liquidatable Accounts</span>
          </div>
          <p className="text-2xl font-bold text-white">{liquidatableAccounts.length}</p>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-dark-400 text-sm">Total Collateral at Risk</span>
          </div>
          <p className="text-2xl font-bold text-white">$146,730</p>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <ArrowRight className="w-5 h-5 text-proton-400" />
            <span className="text-dark-400 text-sm">Liquidation Bonus</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">8%</p>
        </div>
      </div>

      {/* Liquidatable Accounts */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Liquidatable Accounts</h2>

        {filteredAccounts.map((account, index) => (
          <motion.div
            key={account.address}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 hover:border-red-500/30 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Account Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="font-mono text-white">{account.address}</p>
                    <p className="text-xs text-dark-400">Account Address</p>
                  </div>
                </div>

                {/* Health Factor */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-dark-400">Health Factor</span>
                    <span className="font-bold text-red-400">{account.healthFactor}%</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${account.healthFactor}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full rounded-full bg-red-500"
                    />
                  </div>
                </div>

                {/* Assets */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-dark-400 mb-1">Collateral Assets</p>
                    <div className="flex flex-wrap gap-1">
                      {account.collateralAssets.map(asset => (
                        <span key={asset} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg font-medium">
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-dark-400 mb-1">Borrowed Assets</p>
                    <div className="flex flex-wrap gap-1">
                      {account.borrowAssets.map(asset => (
                        <span key={asset} className="px-2 py-1 bg-orange-500/10 text-orange-400 text-xs rounded-lg font-medium">
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Values & Action */}
              <div className="flex flex-col items-end gap-4">
                <div className="text-right">
                  <p className="text-sm text-dark-400">Collateral Value</p>
                  <p className="text-lg font-bold text-emerald-400">{account.collateralValue}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-dark-400">Borrow Value</p>
                  <p className="text-lg font-bold text-orange-400">{account.borrowValue}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-dark-400">Liquidation Bonus</p>
                  <p className="text-lg font-bold text-emerald-400">{account.liquidationBonus}</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Liquidate
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredAccounts.length === 0 && (
          <div className="text-center py-16 glass-card">
            <Shield className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <p className="text-dark-400">No liquidatable accounts found</p>
            <p className="text-sm text-dark-500 mt-1">All accounts are currently healthy</p>
          </div>
        )}
      </div>
    </div>
  )
}
