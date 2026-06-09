import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpDown, TrendingUp, Wallet, ExternalLink } from 'lucide-react'

interface Asset {
  symbol: string
  name: string
  price: number
  totalSupply: string
  totalBorrow: string
  supplyAPY: number
  borrowAPY: number
  utilization: number
  collateralFactor: number
  logo: string
}

const mockAssets: Asset[] = [
  { symbol: 'WETH', name: 'Wrapped ETH', price: 3500, totalSupply: '$45.2M', totalBorrow: '$28.1M', supplyAPY: 3.24, borrowAPY: 5.67, utilization: 62.2, collateralFactor: 75, logo: 'Ξ' },
  { symbol: 'USDC', name: 'USD Coin', price: 1.00, totalSupply: '$89.5M', totalBorrow: '$52.3M', supplyAPY: 4.12, borrowAPY: 6.89, utilization: 58.4, collateralFactor: 80, logo: '$' },
  { symbol: 'USDT', name: 'Tether USD', price: 1.00, totalSupply: '$67.8M', totalBorrow: '$41.2M', supplyAPY: 3.89, borrowAPY: 6.45, utilization: 60.8, collateralFactor: 80, logo: '₮' },
  { symbol: 'DAI', name: 'Dai Stablecoin', price: 1.00, totalSupply: '$34.1M', totalBorrow: '$19.7M', supplyAPY: 3.56, borrowAPY: 6.12, utilization: 57.8, collateralFactor: 80, logo: '◈' },
  { symbol: 'WBTC', name: 'Wrapped BTC', price: 65000, totalSupply: '$23.4M', totalBorrow: '$15.8M', supplyAPY: 2.89, borrowAPY: 5.23, utilization: 67.5, collateralFactor: 75, logo: '₿' },
  { symbol: 'PROTON', name: 'Proton Token', price: 0.50, totalSupply: '$12.1M', totalBorrow: '$3.2M', supplyAPY: 8.45, borrowAPY: 12.34, utilization: 26.4, collateralFactor: 50, logo: '⚡' },
]

type SortKey = keyof Asset

export default function AssetTable() {
  const [sortKey, setSortKey] = useState<SortKey>('supplyAPY')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const sortedAssets = [...mockAssets].sort((a, b) => {
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
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-dark-800/50">
        <h2 className="text-xl font-bold text-white">Markets Overview</h2>
        <p className="text-dark-400 text-sm mt-1">Supply and borrow rates across all assets</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-800/50">
              {[
                { key: 'symbol' as SortKey, label: 'Asset' },
                { key: 'price' as SortKey, label: 'Price' },
                { key: 'totalSupply' as SortKey, label: 'Total Supply' },
                { key: 'supplyAPY' as SortKey, label: 'Supply APY' },
                { key: 'borrowAPY' as SortKey, label: 'Borrow APY' },
                { key: 'utilization' as SortKey, label: 'Utilization' },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-6 py-4 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right text-xs font-semibold text-dark-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAssets.map((asset, index) => (
              <motion.tr
                key={asset.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-dark-800/30 hover:bg-dark-800/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-proton-500/20 to-indigo-500/20 
                                    flex items-center justify-center text-lg font-bold text-proton-400 border border-proton-500/20">
                      {asset.logo}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{asset.symbol}</p>
                      <p className="text-xs text-dark-400">{asset.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-white">
                    ${asset.price.toLocaleString('en-US', { minimumFractionDigits: asset.price < 1 ? 4 : 2 })}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-white">{asset.totalSupply}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-emerald-400">{asset.supplyAPY.toFixed(2)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-orange-400">{asset.borrowAPY.toFixed(2)}%</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-dark-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${asset.utilization}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full rounded-full ${
                          asset.utilization > 80 ? 'bg-red-500' : 
                          asset.utilization > 60 ? 'bg-yellow-500' : 'bg-emerald-500'
                        }`}
                      />
                    </div>
                    <span className="text-sm text-dark-300">{asset.utilization}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-3 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 
                                     rounded-lg hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                      Supply
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium bg-orange-500/10 text-orange-400 
                                     rounded-lg hover:bg-orange-500/20 transition-colors border border-orange-500/20">
                      Borrow
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
