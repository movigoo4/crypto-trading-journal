import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { tradeSchema } from '@/lib/validations'

// GET all trades for current user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    const trades = await db.trades.findByUserId(user.userId)
    
    // Get search query from URL
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    
    let filteredTrades = trades
    
    // Filter by search query
    if (search) {
      filteredTrades = trades.filter(trade => 
        trade.coin.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    return NextResponse.json({
      success: true,
      trades: filteredTrades,
    })
  } catch (error) {
    console.error('Get trades error:', error)
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }
}

// POST create new trade
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    
    // Validate input
    const validation = tradeSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const tradeData = validation.data
    
    // Calculate profit/loss if trade is closed
    let profitLoss = undefined
    if (tradeData.status === 'Closed' && tradeData.exitPrice) {
      const priceDiff = tradeData.type === 'Long' 
        ? tradeData.exitPrice - tradeData.entryPrice
        : tradeData.entryPrice - tradeData.exitPrice
      profitLoss = priceDiff * tradeData.quantity
    }

    const trade = await db.trades.create({
      userId: user.userId,
      coin: tradeData.coin,
      type: tradeData.type,
      entryPrice: tradeData.entryPrice,
      exitPrice: tradeData.exitPrice || null,
      quantity: tradeData.quantity,
      status: tradeData.status,
      notes: tradeData.notes,
      entryDate: new Date(tradeData.entryDate),
      exitDate: tradeData.exitDate ? new Date(tradeData.exitDate) : undefined,
      profitLoss,
    })

    return NextResponse.json({
      success: true,
      trade,
    })
  } catch (error) {
    console.error('Create trade error:', error)
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }
}

