import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  AlertTriangle, 
  Vote,
  Menu,
  X,
  Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/markets', icon: TrendingUp, label: 'Markets' },
  { path: '/portfolio', icon: Wallet, label: 'Portfolio' },
  { path: '/liquidate', icon: AlertTriangle, label: 'Liquidate' },
  { path: '/governance', icon: Vote, label: 'Governance' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-dark-900/95 backdrop-blur-xl border-r border-dark-800/50 
                    transform transition-transform duration-300 lg:transform-none
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-dark-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-proton-500 to-indigo-500 
                              flex items-center justify-center shadow-lg shadow-proton-500/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ProtonDeFi</h1>
                <p className="text-xs text-dark-400">Lending Protocol</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Wallet Connect */}
          <div className="p-4 border-t border-dark-800/50">
            <ConnectButton 
              showBalance={false}
              accountStatus="address"
              chainStatus="icon"
            />
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-dark-800/50 bg-dark-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-dark-800 text-white hover:bg-dark-700 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-white">ProtonDeFi</h1>
          </div>
          <ConnectButton showBalance={false} />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
          }

