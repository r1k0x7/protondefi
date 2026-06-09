import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wallet, ArrowRight, AlertCircle } from 'lucide-react'

interface SupplyModalProps {
  isOpen: boolean
  onClose: () => void
  asset: {
    symbol: string
    name: string
    price: number
    supplyAPY: number
    collateralFactor: number
    balance: string
    logo: string
  }
}

export default function SupplyModal({ isOpen, onClose, asset }: SupplyModalProps) {
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input')

  const maxAmount = parseFloat(asset.balance.replace(/[^0-9.]/g, ''))
  const usdValue = parseFloat(amount || '0') * asset.price

  const handleMax = () => setAmount(maxAmount.toString())

  const handleSupply = () => {
    setStep('confirm')
    // Simulate transaction
    setTimeout(() => setStep('success'), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md glass-card overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-proton-500/20 to-indigo-500/20 
                                flex items-center justify-center text-lg font-bold text-proton-400">
                  {asset.logo}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Supply {asset.symbol}</h3>
                  <p className="text-xs text-dark-400">{asset.name}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-dark-800 transition-colors">
                <X className="w-5 h-5 text-dark-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {step === 'input' && (
                <>
                  {/* Amount Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-400">Amount</span>
                      <button onClick={handleMax} className="text-proton-400 hover:text-proton-300 font-medium">
                        Max: {asset.balance}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="input-field text-2xl font-bold pr-20"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 font-medium">
                        {asset.symbol}
                      </span>
                    </div>
                    <p className="text-right text-sm text-dark-400">≈ ${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3 p-4 bg-dark-800/50 rounded-xl">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-400">Supply APY</span>
                      <span className="font-semibold text-emerald-400">{asset.supplyAPY.toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-400">Collateral Factor</span>
                      <span className="font-semibold text-white">{asset.collateralFactor}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-400">Gas Estimate</span>
                      <span className="font-semibold text-white">~$2.50</span>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-yellow-400">
                      Supplying assets enables them as collateral. Be aware of liquidation risks when borrowing.
                    </p>
                  </div>

                  <button
                    onClick={handleSupply}
                    disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    Supply {asset.symbol}
                  </button>
                </>
              )}

              {step === 'confirm' && (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-2 border-proton-500 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <h4 className="text-lg font-semibold text-white mb-2">Confirming Transaction</h4>
                  <p className="text-dark-400 text-sm">Please confirm the transaction in your wallet...</p>
                </div>
              )}

              {step === 'success' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Supply Successful!</h4>
                  <p className="text-dark-400 text-sm mb-6">You have successfully supplied {amount} {asset.symbol}</p>
                  <button onClick={onClose} className="btn-primary">Done</button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
