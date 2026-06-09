import { useState } from 'react'
import { motion } from 'framer-motion'
import { Vote, Clock, CheckCircle2, XCircle, Users, TrendingUp, MessageSquare } from 'lucide-react'

interface Proposal {
  id: number
  title: string
  description: string
  status: 'active' | 'passed' | 'rejected' | 'pending'
  votesFor: number
  votesAgainst: number
  votesAbstain: number
  totalVotes: number
  endTime: string
  proposer: string
  category: string
}

const proposals: Proposal[] = [
  {
    id: 1,
    title: 'Increase WETH Collateral Factor to 80%',
    description: 'Proposal to increase the collateral factor for WETH from 75% to 80% to improve capital efficiency while maintaining protocol safety.',
    status: 'active',
    votesFor: 2450000,
    votesAgainst: 890000,
    votesAbstain: 120000,
    totalVotes: 3460000,
    endTime: '2 days',
    proposer: '0x7a2...3f9b',
    category: 'Risk Parameters',
  },
  {
    id: 2,
    title: 'Add LINK as Collateral Asset',
    description: 'Add Chainlink (LINK) as a supported collateral asset with a 65% collateral factor and 10% reserve factor.',
    status: 'active',
    votesFor: 1890000,
    votesAgainst: 1560000,
    votesAbstain: 340000,
    totalVotes: 3790000,
    endTime: '5 days',
    proposer: '0x9c4...8e2a',
    category: 'Asset Listing',
  },
  {
    id: 3,
    title: 'Reduce Reserve Factor for Stablecoins',
    description: 'Reduce the reserve factor for USDC, USDT, and DAI from 10% to 5% to increase supplier yields.',
    status: 'passed',
    votesFor: 4120000,
    votesAgainst: 560000,
    votesAbstain: 180000,
    totalVotes: 4860000,
    endTime: 'Ended',
    proposer: '0x3f1...7d4c',
    category: 'Fee Structure',
  },
  {
    id: 4,
    title: 'Implement Flash Loan Functionality',
    description: 'Add flash loan capability to the protocol with a 0.09% fee, enabling advanced DeFi strategies.',
    status: 'rejected',
    votesFor: 1200000,
    votesAgainst: 3100000,
    votesAbstain: 450000,
    totalVotes: 4750000,
    endTime: 'Ended',
    proposer: '0x8b2...1a5d',
    category: 'Protocol Enhancement',
  },
]

export default function Governance() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'passed' | 'rejected'>('all')

  const filteredProposals = proposals.filter(p => activeTab === 'all' || p.status === activeTab)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-proton-500/10 text-proton-400 border-proton-500/20'
      case 'passed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-dark-800 text-dark-400 border-dark-700'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Governance</h1>
          <p className="text-dark-400 mt-1">Participate in protocol decisions with PROTON tokens</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Vote className="w-4 h-4" />
          Create Proposal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-proton-500/10 rounded-lg">
              <Users className="w-5 h-5 text-proton-400" />
            </div>
            <span className="text-dark-400 text-sm">Total Voters</span>
          </div>
          <p className="text-2xl font-bold text-white">2,847</p>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-dark-400 text-sm">Passed Proposals</span>
          </div>
          <p className="text-2xl font-bold text-white">12</p>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-dark-400 text-sm">Active Proposals</span>
          </div>
          <p className="text-2xl font-bold text-white">2</p>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-dark-400 text-sm">PROTON Price</span>
          </div>
          <p className="text-2xl font-bold text-white">$0.50</p>
        </div>
      </div>

      {/* Proposals */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white">Proposals</h2>
          <div className="flex items-center bg-dark-800 rounded-xl p-1">
            {(['all', 'active', 'passed', 'rejected'] as const).map((type) => (
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

        {filteredProposals.map((proposal, index) => (
          <motion.div
            key={proposal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 hover:border-proton-500/30 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(proposal.status)}`}>
                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                  </span>
                  <span className="text-xs text-dark-400">{proposal.category}</span>
                  <span className="text-xs text-dark-500">by {proposal.proposer}</span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{proposal.title}</h3>
                <p className="text-dark-400 text-sm mb-4 leading-relaxed">{proposal.description}</p>

                {/* Vote Progress */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-400 w-12">For</span>
                    <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(proposal.votesFor / proposal.totalVotes) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full rounded-full bg-emerald-500"
                      />
                    </div>
                    <span className="text-xs text-white w-16 text-right">
                      {((proposal.votesFor / proposal.totalVotes) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-400 w-12">Against</span>
                    <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(proposal.votesAgainst / proposal.totalVotes) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full rounded-full bg-red-500"
                      />
                    </div>
                    <span className="text-xs text-white w-16 text-right">
                      {((proposal.votesAgainst / proposal.totalVotes) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 min-w-[200px]">
                <div className="text-right">
                  <p className="text-sm text-dark-400">Total Votes</p>
                  <p className="text-lg font-bold text-white">{(proposal.totalVotes / 1e6).toFixed(2)}M PROTON</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-dark-400">{proposal.status === 'active' ? 'Ends in' : 'Ended'}</p>
                  <p className="text-sm font-medium text-white">{proposal.endTime}</p>
                </div>

                {proposal.status === 'active' && (
                  <div className="flex items-center gap-2 mt-2">
                    <button className="px-4 py-2 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-lg 
                                     hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                      Vote For
                    </button>
                    <button className="px-4 py-2 bg-red-500/10 text-red-400 text-sm font-medium rounded-lg 
                                     hover:bg-red-500/20 transition-colors border border-red-500/20">
                      Vote Against
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredProposals.length === 0 && (
          <div className="text-center py-16 glass-card">
            <MessageSquare className="w-12 h-12 text-dark-600 mx-auto mb-4" />
            <p className="text-dark-400">No proposals found</p>
          </div>
        )}
      </div>
    </div>
  )
}
