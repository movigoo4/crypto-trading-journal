'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  delay?: number
  trend?: 'up' | 'down' | 'neutral'
  isMoney?: boolean
}

export default function StatsCard({ title, value, subtitle, icon: Icon, delay = 0, trend = 'neutral', isMoney = false }: StatsCardProps) {
  const trendColors = {
    up: 'text-neon-green',
    down: 'text-red-400',
    neutral: 'text-zinc-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="stats-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary-light" />
        </div>
      </div>
      
      <h3 className="text-zinc-400 text-sm font-medium mb-2">{title}</h3>
      <p className={`text-3xl font-bold mb-1 ${
        isMoney && typeof value === 'string' && value.includes('$')
          ? (value.includes('-') ? 'text-rose-400' : 'text-emerald-400')
          : 'text-white'
      }`}>
        {value}
      </p>
      {subtitle && (
        <p className={`text-sm ${trendColors[trend]}`}>{subtitle}</p>
      )}
    </motion.div>
  )
}

