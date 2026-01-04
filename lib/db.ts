// Mock database using in-memory storage
// In production, this would connect to MongoDB or another database

import { User, Trade } from '@/types'
import bcrypt from 'bcryptjs'

// In-memory storage (replace with actual DB in production)
const users: Map<string, User & { password: string }> = new Map()
const trades: Map<string, Trade> = new Map()

// Initialize with a demo user
const initDb = () => {
  if (users.size === 0) {
    const hashedPassword = bcrypt.hashSync('demo123', 10)
    const demoUser = {
      id: 'demo-user-id',
      email: 'demo@crypto.com',
      name: 'Demo User',
      password: hashedPassword,
      createdAt: new Date(),
    }
    users.set(demoUser.email, demoUser)
    
    // Add some demo trades
    const demoTrades: Trade[] = [
      {
        id: 'trade-1',
        userId: 'demo-user-id',
        coin: 'BTC',
        type: 'Long',
        entryPrice: 42000,
        exitPrice: 45000,
        quantity: 0.5,
        status: 'Closed',
        entryDate: new Date('2024-01-15'),
        exitDate: new Date('2024-01-20'),
        profitLoss: 1500,
        notes: 'Strong uptrend breakout',
      },
      {
        id: 'trade-2',
        userId: 'demo-user-id',
        coin: 'ETH',
        type: 'Long',
        entryPrice: 2200,
        exitPrice: 2100,
        quantity: 2,
        status: 'Closed',
        entryDate: new Date('2024-01-18'),
        exitDate: new Date('2024-01-22'),
        profitLoss: -200,
        notes: 'Stop loss triggered',
      },
      {
        id: 'trade-3',
        userId: 'demo-user-id',
        coin: 'SOL',
        type: 'Short',
        entryPrice: 95,
        exitPrice: null,
        quantity: 10,
        status: 'Open',
        entryDate: new Date('2024-01-25'),
        notes: 'Resistance level short',
      },
      {
        id: 'trade-4',
        userId: 'demo-user-id',
        coin: 'BTC',
        type: 'Long',
        entryPrice: 43500,
        exitPrice: 46200,
        quantity: 0.3,
        status: 'Closed',
        entryDate: new Date('2024-01-10'),
        exitDate: new Date('2024-01-15'),
        profitLoss: 810,
        notes: 'Bullish momentum',
      },
    ]
    
    demoTrades.forEach(trade => {
      trades.set(trade.id, trade)
    })
  }
}

initDb()

export const db = {
  users: {
    findByEmail: async (email: string) => {
      return users.get(email)
    },
    create: async (userData: { email: string; name: string; password: string }) => {
      const id = `user-${Date.now()}`
      const user = {
        id,
        ...userData,
        createdAt: new Date(),
      }
      users.set(userData.email, user)
      return user
    },
  },
  trades: {
    findByUserId: async (userId: string) => {
      return Array.from(trades.values()).filter(trade => trade.userId === userId)
    },
    findById: async (id: string) => {
      return trades.get(id)
    },
    create: async (tradeData: Omit<Trade, 'id'>) => {
      const id = `trade-${Date.now()}`
      const trade = {
        id,
        ...tradeData,
      }
      trades.set(id, trade)
      return trade
    },
    update: async (id: string, tradeData: Partial<Trade>) => {
      const existingTrade = trades.get(id)
      if (!existingTrade) return null
      
      const updatedTrade = {
        ...existingTrade,
        ...tradeData,
      }
      trades.set(id, updatedTrade)
      return updatedTrade
    },
    delete: async (id: string) => {
      return trades.delete(id)
    },
  },
}

