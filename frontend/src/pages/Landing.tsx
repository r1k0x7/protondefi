import { useState } from 'react'
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { 
  Zap, Shield, TrendingUp, Lock, Globe, ChevronRight, 
  BarChart3, Layers, ArrowRight, CheckCircle2 
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Secure Collateralization',
    description: 'Over-collateralized lending with real-time health monitoring and automatic liquidation protection.',
  },
  {
    icon: TrendingUp,
    title: 'Competitive Yields',
    description: 'Earn attractive APY on your deposits with dynamic interest rates based on market demand.',
  },
  {
    icon: Lock,
    title: 'Non-Custodial',
    description: 'You retain full control of your assets. No centralized authority can freeze or seize your funds.',
  },
  {
    icon: Globe,
    title: 'Multi-Asset Support',
    description: 'Deposit and borrow across multiple assets including ETH, stablecoins, and governance tokens.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track your portfolio performance, health factor, and market trends with advanced dashboards.',
  },
  {
    icon: Layers,
    title: 'Composable',
    description: 'Built with modularity in mind, enabling seamless integration with other DeFi protocols.',
  },
]

const stats = [
  { label: 'Total Value Locked', value: '$284.5M' },
  { label: 'Total Markets', value: '6' },
  { label: 'Active Users', value: '12.4K' },
  { label: 'Protocol Revenue', value: '$1.2M' },
]

export default function Landing() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-proton-500 to-indigo-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">ProtonDeFi</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-dark-300 hover:text-white transition-colors">Features</a>
              <a href="#markets" className="text-sm text-dark-300 hover:text-white transition-colors">Markets</a>
              <a href="#security" className="text-sm text-dark-300 hover:text-white transition-colors">Security</a>
              <a href="#docs" className="text-sm text-dark-300 hover:text-white transition-colors">Docs</a>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-proton-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-proton-500/10 border border-proton-500/20 text-proton-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Protocol Live on Ethereum Mainnet
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Decentralized Lending
              <span className="block text-gradient">Reimagined</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-dark-300 mb-10">
              Supply assets to earn yield, borrow against your collateral, and participate in 
              protocol governance. Secure, transparent, and fully decentralized.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ConnectButton />
              <button className="px-6 py-3 bg-dark-800 text-white font-semibold rounded-xl hover:bg-dark-700 transition-all duration-300 border border-dark-700 flex items-center gap-2">
                View Documentation
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-dark-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Why ProtonDeFi?</h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Built from the ground up with security, efficiency, and user experience at its core.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 hover:border-proton-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-proton-500/20 to-indigo-500/20 
                                flex items-center justify-center mb-4 group-hover:from-proton-500/30 group-hover:to-indigo-500/30 transition-all">
                  <feature.icon className="w-6 h-6 text-proton-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Three simple steps to start earning yield or accessing liquidity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Wallet',
                description: 'Connect your Web3 wallet to access the protocol. No KYC or registration required.',
              },
              {
                step: '02',
                title: 'Deposit Assets',
                description: 'Supply supported assets as collateral to start earning yield immediately.',
              },
              {
                step: '03',
                title: 'Borrow or Earn',
                description: 'Borrow against your collateral or simply earn passive income on your deposits.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-dark-800 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-dark-400">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 right-0 translate-x-1/2">
                    <ChevronRight className="w-8 h-8 text-dark-700" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Security First
                <span className="block text-gradient">Always</span>
              </h2>
              <p className="text-dark-400 mb-8">
                Our protocol has been designed with multiple layers of security to protect user funds 
                and ensure the integrity of the lending markets.
              </p>
              <div className="space-y-4">
                {[
                  'Multi-sig admin controls with timelock',
                  'Real-time price oracle with Chainlink integration',
                  'Automated liquidation mechanism',
                  'Reserve fund for protocol insurance',
                  'Regular security audits by top firms',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-dark-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-proton-500/10 rounded-full blur-2xl" />
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      <span className="text-white font-medium">Smart Contract Audit</span>
                    </div>
                    <span className="text-emerald-400 text-sm font-medium">Passed</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-emerald-400" />
                      <span className="text-white font-medium">Timelock Protection</span>
                    </div>
                    <span className="text-emerald-400 text-sm font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-emerald-400" />
                      <span className="text-white font-medium">Oracle Health</span>
                    </div>
                    <span className="text-emerald-400 text-sm font-medium">Healthy</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-proton-500/5 to-indigo-500/5" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Start?
              </h2>
              <p className="text-dark-400 mb-8 max-w-xl mx-auto">
                Join thousands of users already earning yield and accessing liquidity on ProtonDeFi.
              </p>
              <ConnectButton />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-proton-500 to-indigo-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">ProtonDeFi</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-dark-400">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
            </div>
            <p className="text-sm text-dark-500">© 2024 ProtonDeFi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
