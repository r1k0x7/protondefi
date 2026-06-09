import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, ArrowUpDown, Info } from 'lucide-react'

interface Market {
  symbol: string
  name: string
  price: number
  priceChange24h: number
  totalSupply: string
  totalBorrow: string
  supplyAPY: number
  borrowAPY: number
  utilization: number
  collateralFactor: number
  liquidity: string
  logo: string
}

const markets: Market[] = [
  { symbol: 'WETH', name: 'Wrapped ETH', price: 3500, priceChange24h: 2.4, totalSupply: '$45.2M', totalBorrow: '$28.1M', supplyAPY: 3.24, borrowAPY: 5.67, utilization: 62.2, collateralFactor: 75, liquidity: '$17.1M', logo: 'Ξ' },
  { symbol: 'USDC', name: 'USD Coin', price: 1.00, priceChange24h: 0.01, totalSupply: '$89.5M', totalBorrow: '$52.3M', supplyAPY: 4.12, borrowAPY: 6.89, utilization: 58.4, collateralFactor: 80, liquidity: '$37.2M', logo: '$' },
  { symbol: 'USDT', name: 'Tether USD', price: 1.00, priceChange24h: -0.02, totalSupply: '$67.8M', totalBorrow: '$41.2M', supplyAPY: 3.89, borrowAPY: 6.45, utilization: 60.8, collateralFactor: 80, liquidity: '$26.6M', logo: '₮' },
  { symbol: 'DAI', name: 'Dai Stablecoin', price: 1.00, priceChange24h: 0.00, totalSupply: '$34.1M', totalBorrow: '$19.7M', supplyAPY: 3.56, borrowAPY: 6.12, utilization: 57.8, collateralFactor: 80, liquidity: '$14.4M', logo: '◈' },
  { symbol: 'WBTC', name: 'Wrapped BTC', price: 65000, priceChange24h: -1.2, totalSupply: '$23.4M', totalBorrow: '$15.8M', supplyAPY: 2.89, borrowAPY: 5.23, utilization: 67.5, collateralFactor: 75, liquidity: '$7.6M', logo: '₿' },
  { symbol: 'PROTON', name: 'Proton Token', price: 0.50, priceChange24h: 5.6, totalSupply: '$12.1M', totalBorrow: '$3.2M', supplyAPY: 8.45, borrowAPY: 12.34, utilization: 26.4, collateralFactor: 50, liquidity: '$8.9M', logo: '⚡' },
]

type SortKey = keyof Market

export default function Markets() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('supplyAPY')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [filterType, setFilterType] = useState<'all' | 'supply' | 'borrow'>('all')

  const filteredMarkets = markets
    .filter(m => 
      m.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      }
      return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal))
    })

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Markets</h1>
          <p className="text-dark-400 mt-1">Explore all available lending markets</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 w-64"
            />
          </div>
          <div className="flex items-center bg-dark-800 rounded-xl p-1">
            {(['all', 'supply', 'borrow'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterType === type
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

      {/* Market Cards Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredMarkets.map((market, index) => (
          <motion.div
            key={market.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-6 hover:border-proton-500/30 transition-all duration-300 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-proton-500/20 to-indigo-500/20 
                                flex items-center justify-center text-xl font-bold text-proton-400 border border-proton-500/20">
                  {market.logo}
                </div>
                <div>
                  <h3 className="font-bold text-white">{market.symbol}</h3>
                  <p className="text-xs text-dark-400">{market.name}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                market.priceChange24h >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {market.priceChange24h >= 0 ? '+' : ''}{market.priceChange24h}%
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <p className="text-2xl font-bold text-white">
                ${market.price.toLocaleString('en-US', { minimumFractionDigits: market.price < 1 ? 4 : 2 })}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-dark-800/50 rounded-xl">
                <p className="text-xs text-dark-400 mb-1">Supply APY</p>
                <p className="font-semibold text-emerald-400">{market.supplyAPY.toFixed(2)}%</p>
              </div>
              <div className="p-3 bg-dark-800/50 rounded-xl">
                <p className="text-xs text-dark-400 mb-1">Borrow APY</p>
                <p className="font-semibold text-orange-400">{market.borrowAPY.toFixed(2)}%</p>
              </div>
              <div className="p-3 bg-dark-800/50 rounded-xl">
                <p className="text-xs text-dark-400 mb-1">Total Supply</p>
                <p className="font-semibold text-white">{market.totalSupply}</p>
              </div>
              <div className="p-3 bg-dark-800/50 rounded-xl">
                <p className="text-xs text-dark-400 mb-1">Liquidity</p>
                <p className="font-semibold text-white">{market.liquidity}</p>
              </div>
            </div>

            {/* Utilization Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-dark-400">Utilization</span>
                <span className="text-white font-medium">{market.utilization}%</span>
              </div>
              <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${market.utilization}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full rounded-full ${
                    market.utilization > 80 ? 'bg-red-500' : 
                    market.utilization > 60 ? 'bg-yellow-500' : 'bg-emerald-500'
                  }`}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="flex-1 py-2.5 bg-emerald-500/10 text-emerald-400 font-medium rounded-lg 
                               hover:bg-emerald-500/20 transition-colors border border-emerald-500/20 text-sm">
                Supply
              </button>
              <button className="flex-1 py-2.5 bg-orange-500/10 text-orange-400 font-medium rounded-lg 
                               hover:bg-orange-500/20 transition-colors border border-orange-500/20 text-sm">
                Borrow
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredMarkets.length === 0 && (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">No markets found matching your search</p>
        </div>
      )}
    </div>
  )
}
