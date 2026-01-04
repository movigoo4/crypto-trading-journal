'use client'

import { useState, useMemo } from 'react'
import { Trade } from '@/types'
import { motion } from 'framer-motion'
import { Search, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import TradeModal from './TradeModal'

interface TradeTableProps {
  trades: Trade[]
  onRefresh: () => void
}

export default function TradeTable({ trades, onRefresh }: TradeTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null)

  const filteredTrades = useMemo(() => {
    return trades.filter(trade =>
      trade.coin.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [trades, searchQuery])

  const handleAddTrade = async (data: any) => {
    try {
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsModalOpen(false)
        onRefresh()
      }
    } catch (error) {
      console.error('Failed to add trade:', error)
    }
  }

  const handleEditTrade = async (data: any) => {
    if (!editingTrade) return

    try {
      const response = await fetch(`/api/trades/${editingTrade.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsModalOpen(false)
        setEditingTrade(null)
        onRefresh()
      }
    } catch (error) {
      console.error('Failed to update trade:', error)
    }
  }

  const handleDeleteTrade = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trade?')) return

    try {
      const response = await fetch(`/api/trades/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error('Failed to delete trade:', error)
    }
  }

  const openEditModal = (trade: Trade) => {
    setEditingTrade(trade)
    setIsModalOpen(true)
  }

  const openAddModal = () => {
    setEditingTrade(null)
    setIsModalOpen(true)
  }

  return (
    <div className="glass-card p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Trading Log</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by coin..."
              className="glass-input pl-10 w-full sm:w-64"
            />
          </div>
          
          <button onClick={openAddModal} className="glow-button whitespace-nowrap">
            + Add Trade
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">Coin</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">Type</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">Entry Price</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">Exit Price</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">Quantity</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">P/L</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-zinc-500">
                  {searchQuery ? 'No trades found matching your search' : 'No trades yet. Add your first trade!'}
                </td>
              </tr>
            ) : (
              filteredTrades.map((trade, index) => (
                <motion.tr
                  key={trade.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <span className="text-xs font-bold">{trade.coin[0]}</span>
                      </div>
                      <span className="font-semibold">{trade.coin}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      {trade.type === 'Long' ? (
                        <TrendingUp className="w-4 h-4 text-neon-green" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                      <span className={trade.type === 'Long' ? 'text-neon-green' : 'text-red-400'}>
                        {trade.type}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-zinc-300">
                    ${trade.entryPrice.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-zinc-300">
                    {trade.exitPrice ? `$${trade.exitPrice.toLocaleString()}` : '-'}
                  </td>
                  <td className="py-4 px-4 text-zinc-300">{trade.quantity}</td>
                  <td className="py-4 px-4">
                    {trade.profitLoss ? (
                      <span className={trade.profitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {trade.profitLoss >= 0 ? '+' : ''}${trade.profitLoss.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-zinc-500">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        trade.status === 'Open'
                          ? 'bg-blue-500/20 text-blue-400'
                          : trade.status === 'Closed' && trade.profitLoss && trade.profitLoss > 0
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : trade.status === 'Closed' && trade.profitLoss && trade.profitLoss < 0
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-zinc-700/50 text-zinc-400'
                      }`}
                    >
                      {trade.status === 'Open'
                        ? 'Open'
                        : trade.status === 'Closed' && trade.profitLoss && trade.profitLoss > 0
                        ? 'Won'
                        : trade.status === 'Closed' && trade.profitLoss && trade.profitLoss < 0
                        ? 'Lost'
                        : trade.status === 'Cancelled'
                        ? 'Cancelled'
                        : trade.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(trade)}
                        className="p-2 rounded-lg hover:bg-primary/20 transition-colors group"
                      >
                        <Edit className="w-4 h-4 text-zinc-400 group-hover:text-primary" />
                      </button>
                      <button
                        onClick={() => handleDeleteTrade(trade.id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 transition-colors group"
                      >
                        <Trash2 className="w-4 h-4 text-zinc-400 group-hover:text-red-400" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TradeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTrade(null)
        }}
        onSubmit={editingTrade ? handleEditTrade : handleAddTrade}
        trade={editingTrade}
      />
    </div>
  )
}

