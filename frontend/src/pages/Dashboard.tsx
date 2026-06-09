import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, Wallet, PiggyBank, ArrowUpRight, 
  Activity, DollarSign, BarChart3, Zap 
} from 'lucide-react'
import StatsCard from '../components/StatsCard'
import AssetTable from '../components/AssetTable'
import HealthBar from '../components/HealthBar'
import SupplyModal from '../components/SupplyModal'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const chartData = [
  { name: 'Jan', tvl: 120, supply: 80, borrow: 40 },
  { name: 'Feb', tvl: 145, supply: 95, borrow: 50 },
  { name: 'Mar', tvl: 180, supply: 120, borrow: 60 },
  { name: 'Apr', tvl: 210, supply: 140, borrow: 70 },
  { name: 'May', tvl: 250, supply: 165, borrow: 85 },
  { name: 'Jun', tvl: 284, supply: 190, borrow: 94 },
]

const recentActivity = [
  { type: 'supply', asset: 'WETH', amount: '5.0', value: '$17,500', time: '2 min ago' },
  { type: 'borrow', asset: 'USDC', amount: '10,000', value: '$10,000', time: '15 min ago' },
  { type: 'repay', asset: 'DAI', amount: '5,000', value: '$5,000', time: '1 hour ago' },
  { type: 'withdraw', asset: 'WBTC', amount: '0.5', value: '$32,500', time: '2 hours ago' },
]

export default function Dashboard() {
  const [showSupplyModal, setShowSupplyModal] = useState(false)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-dark-400 mt-1">Overview of your lending activity</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Deposit
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Borrow
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Supplied"
          value="$45,230.50"
          subtitle="Across 4 assets"
          change={12.5}
          icon={PiggyBank}
          index={0}
        />
        <StatsCard
          title="Total Borrowed"
          value="$12,450.00"
          subtitle="Across 2 assets"
          change={-3.2}
          icon={TrendingUp}
          index={1}
        />
        <StatsCard
          title="Net APY"
          value="4.82%"
          subtitle="Weighted average"
          change={0.8}
          icon={Activity}
          index={2}
        />
        <StatsCard
          title="Available to Borrow"
          value="$21,500.00"
          subtitle="Based on collateral"
          icon={DollarSign}
          index={3}
        />
      </div>

      {/* Health Bar & Chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <HealthBar
            healthFactor={78.5}
            collateralValue="$45,230.50"
            borrowValue="$12,450.00"
          />
        </div>

        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Protocol Growth</h3>
              <p className="text-sm text-dark-400">TVL over the last 6 months</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-proton-500" />
                <span className="text-dark-400">TVL</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-dark-400">Supply</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-dark-400">Borrow</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTvl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="tvl" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorTvl)" strokeWidth={2} />
              <Area type="monotone" dataKey="supply" stroke="#10b981" fillOpacity={1} fill="url(#colorSupply)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-dark-800/50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            <p className="text-sm text-dark-400">Your latest transactions</p>
          </div>
          <button className="text-proton-400 text-sm font-medium hover:text-proton-300 transition-colors flex items-center gap-1">
            View All <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y divide-dark-800/30">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 hover:bg-dark-800/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activity.type === 'supply' ? 'bg-emerald-500/10 text-emerald-400' :
                  activity.type === 'borrow' ? 'bg-orange-500/10 text-orange-400' :
                  activity.type === 'repay' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {activity.type === 'supply' && <PiggyBank className="w-5 h-5" />}
                  {activity.type === 'borrow' && <TrendingUp className="w-5 h-5" />}
                  {activity.type === 'repay' && <Wallet className="w-5 h-5" />}
                  {activity.type === 'withdraw' && <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-white capitalize">{activity.type} {activity.asset}</p>
                  <p className="text-sm text-dark-400">{activity.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">{activity.amount} {activity.asset}</p>
                <p className="text-sm text-dark-400">{activity.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Asset Table */}
      <AssetTable />

      {/* Supply Modal */}
      <SupplyModal
        isOpen={showSupplyModal}
        onClose={() => setShowSupplyModal(false)}
        asset={{
          symbol: 'WETH',
          name: 'Wrapped ETH',
          price: 3500,
          supplyAPY: 3.24,
          collateralFactor: 75,
          balance: '10.5 WETH',
          logo: 'Ξ',
        }}
      />
    </div>
  )
                  }
                                                     
