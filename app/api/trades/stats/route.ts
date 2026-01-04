import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const user = await requireAuth()
    const trades = await db.trades.findByUserId(user.userId)
    
    const closedTrades = trades.filter(t => t.status === 'Closed')
    const totalTrades = closedTrades.length
    const openTrades = trades.filter(t => t.status === 'Open').length
    
    const winningTrades = closedTrades.filter(t => t.profitLoss && t.profitLoss > 0).length
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0
    
    const netProfit = closedTrades.reduce((sum, trade) => {
      return sum + (trade.profitLoss || 0)
    }, 0)
    
    return NextResponse.json({
      success: true,
      stats: {
        totalTrades,
        winRate: Math.round(winRate * 10) / 10,
        netProfit: Math.round(netProfit * 100) / 100,
        openTrades,
      },
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }
}

