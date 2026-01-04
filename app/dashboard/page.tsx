import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user data
  const userData = await db.users.findByEmail(user.email)
  if (!userData) {
    redirect('/login')
  }

  // Fetch initial trades
  const trades = await db.trades.findByUserId(user.userId)

  // Calculate stats
  const closedTrades = trades.filter(t => t.status === 'Closed')
  const totalTrades = closedTrades.length
  const openTrades = trades.filter(t => t.status === 'Open').length
  const winningTrades = closedTrades.filter(t => t.profitLoss && t.profitLoss > 0).length
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0
  const netProfit = closedTrades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0)

  const stats = {
    totalTrades,
    winRate: Math.round(winRate * 10) / 10,
    netProfit: Math.round(netProfit * 100) / 100,
    openTrades,
  }

  return (
    <DashboardClient
      userName={userData.name}
      userEmail={userData.email}
      initialTrades={trades}
      initialStats={stats}
    />
  )
}

