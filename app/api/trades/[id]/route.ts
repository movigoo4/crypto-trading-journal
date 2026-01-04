import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { tradeSchema } from '@/lib/validations'

// PUT update trade
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const body = await request.json()
    
    // Check if trade exists and belongs to user
    const existingTrade = await db.trades.findById(id)
    if (!existingTrade || existingTrade.userId !== user.userId) {
      return NextResponse.json(
        { success: false, message: 'Trade not found' },
        { status: 404 }
      )
    }
    
    // Validate input
    const validation = tradeSchema.partial().safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const tradeData = validation.data
    
    // Calculate profit/loss if trade is closed
    let profitLoss = existingTrade.profitLoss
    if (tradeData.status === 'Closed' && tradeData.exitPrice) {
      const entryPrice = tradeData.entryPrice || existingTrade.entryPrice
      const quantity = tradeData.quantity || existingTrade.quantity
      const type = tradeData.type || existingTrade.type
      
      const priceDiff = type === 'Long' 
        ? tradeData.exitPrice - entryPrice
        : entryPrice - tradeData.exitPrice
      profitLoss = priceDiff * quantity
    }

    const updatedData: any = {
      ...tradeData,
      profitLoss,
    }

    if (tradeData.entryDate) {
      updatedData.entryDate = new Date(tradeData.entryDate)
    }
    if (tradeData.exitDate) {
      updatedData.exitDate = new Date(tradeData.exitDate)
    }

    const trade = await db.trades.update(id, updatedData)

    return NextResponse.json({
      success: true,
      trade,
    })
  } catch (error) {
    console.error('Update trade error:', error)
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }
}

// DELETE trade
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params
    
    // Check if trade exists and belongs to user
    const existingTrade = await db.trades.findById(id)
    if (!existingTrade || existingTrade.userId !== user.userId) {
      return NextResponse.json(
        { success: false, message: 'Trade not found' },
        { status: 404 }
      )
    }

    await db.trades.delete(id)

    return NextResponse.json({
      success: true,
      message: 'Trade deleted successfully',
    })
  } catch (error) {
    console.error('Delete trade error:', error)
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }
}

