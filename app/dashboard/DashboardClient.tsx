'use client'

import { useState, useEffect } from 'react'
import { Trade, DashboardStats } from '@/types'
import DashboardHeader from '@/components/DashboardHeader'
import StatsCard from '@/components/StatsCard'
import TradeTable from '@/components/TradeTable'
import { TrendingUp, Activity, DollarSign, BarChart3 } from 'lucide-react'

interface DashboardClientProps {
  userName: string
  userEmail: string
  initialTrades: Trade[]
  initialStats: DashboardStats
}

export default function DashboardClient({
  userName,
  userEmail,
  initialTrades,
  initialStats,
}: DashboardClientProps) {
  const [trades, setTrades] = useState<Trade[]>(initialTrades)
  const [stats, setStats] = useState<DashboardStats>(initialStats)

  const refreshData = async () => {
    try {
      // Fetch updated trades
      const tradesResponse = await fetch('/api/trades')
      const tradesData = await tradesResponse.json()
      if (tradesData.success) {
        setTrades(tradesData.trades)
      }

      // Fetch updated stats
      const statsResponse = await fetch('/api/trades/stats')
      const statsData = await statsResponse.json()
      if (statsData.success) {
        setStats(statsData.stats)
      }
    } catch (error) {
      console.error('Failed to refresh data:', error)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader userName={userName} userEmail={userEmail} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Trades"
            value={stats.totalTrades}
            subtitle={`${stats.openTrades} open trades`}
            icon={BarChart3}
            delay={0}
          />
          <StatsCard
            title="Win Rate"
            value={`${stats.winRate}%`}
            subtitle={stats.winRate >= 50 ? 'Above average' : 'Keep improving'}
            icon={Activity}
            trend={stats.winRate >= 50 ? 'up' : 'down'}
            delay={0.1}
          />
          <StatsCard
            title="Net Profit"
            value={`$${stats.netProfit.toLocaleString()}`}
            subtitle={stats.netProfit >= 0 ? 'Profitable' : 'In loss'}
            icon={DollarSign}
            trend={stats.netProfit >= 0 ? 'up' : 'down'}
            delay={0.2}
            isMoney={true}
          />
          <StatsCard
            title="Performance"
            value={stats.totalTrades > 0 ? (stats.netProfit / stats.totalTrades).toFixed(2) : '0.00'}
            subtitle="Avg P/L per trade"
            icon={TrendingUp}
            trend={stats.totalTrades > 0 && stats.netProfit / stats.totalTrades >= 0 ? 'up' : 'down'}
            delay={0.3}
          />
        </div>

        {/* Trading Log Table */}
        <TradeTable trades={trades} onRefresh={refreshData} />
      </div>
    </div>
  )
}

