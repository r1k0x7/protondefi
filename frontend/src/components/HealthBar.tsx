import { motion } from 'framer-motion'
import { Heart, AlertTriangle, Shield } from 'lucide-react'

interface HealthBarProps {
  healthFactor: number // 0-100
  collateralValue: string
  borrowValue: string
}

export default function HealthBar({ healthFactor, collateralValue, borrowValue }: HealthBarProps) {
  const getHealthColor = () => {
    if (healthFactor >= 80) return 'bg-emerald-500'
    if (healthFactor >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getHealthIcon = () => {
    if (healthFactor >= 80) return Shield
    if (healthFactor >= 50) return Heart
    return AlertTriangle
  }

  const Icon = getHealthIcon()

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${healthFactor >= 80 ? 'text-emerald-400' : healthFactor >= 50 ? 'text-yellow-400' : 'text-red-400'}`} />
          <h3 className="text-lg font-bold text-white">Account Health</h3>
        </div>
        <span className={`text-2xl font-bold ${healthFactor >= 80 ? 'text-emerald-400' : healthFactor >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
          {healthFactor.toFixed(1)}%
        </span>
      </div>

      <div className="relative h-3 bg-dark-800 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${healthFactor}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${getHealthColor()}`}
        />
        {/* Liquidation threshold marker */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-red-500/50" style={{ left: '30%' }}>
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-red-400 whitespace-nowrap">
            Liquidation
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-dark-800/50 rounded-xl">
          <p className="text-xs text-dark-400 mb-1">Collateral Value</p>
          <p className="text-lg font-bold text-emerald-400">{collateralValue}</p>
        </div>
        <div className="p-3 bg-dark-800/50 rounded-xl">
          <p className="text-xs text-dark-400 mb-1">Borrow Value</p>
          <p className="text-lg font-bold text-orange-400">{borrowValue}</p>
        </div>
      </div>

      {healthFactor < 50 && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-400">
            Your account is at risk of liquidation. Consider repaying borrowed assets or adding more collateral.
          </p>
        </div>
      )}
    </div>
  )
}
