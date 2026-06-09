import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  subtitle?: string
  change?: number
  icon: LucideIcon
  index?: number
}

export default function StatsCard({ title, value, subtitle, change, icon: Icon, index = 0 }: StatsCardProps) {
  const isPositive = change && change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-dark-800/50">
          <Icon className="w-5 h-5 text-proton-400" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-dark-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {subtitle && <p className="text-dark-500 text-xs">{subtitle}</p>}
    </motion.div>
  )
}
