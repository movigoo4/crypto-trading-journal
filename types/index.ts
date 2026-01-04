export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface Trade {
  id: string
  userId: string
  coin: string
  type: 'Long' | 'Short'
  entryPrice: number
  exitPrice: number | null
  quantity: number
  status: 'Open' | 'Closed' | 'Cancelled'
  notes?: string
  entryDate: Date
  exitDate?: Date
  profitLoss?: number
}

export interface AuthResponse {
  success: boolean
  token?: string
  user?: User
  message?: string
}

export interface TradeResponse {
  success: boolean
  trade?: Trade
  trades?: Trade[]
  message?: string
}

export interface DashboardStats {
  totalTrades: number
  winRate: number
  netProfit: number
  openTrades: number
}

