'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tradeSchema, type TradeInput } from '@/lib/validations'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Trade } from '@/types'

interface TradeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  trade?: Trade | null
}

export default function TradeModal({ isOpen, onClose, onSubmit, trade }: TradeModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!trade

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TradeInput>({
    resolver: zodResolver(tradeSchema),
    defaultValues: trade ? {
      coin: trade.coin,
      type: trade.type,
      entryPrice: trade.entryPrice,
      exitPrice: trade.exitPrice || undefined,
      quantity: trade.quantity,
      status: trade.status,
      notes: trade.notes || '',
      entryDate: trade.entryDate.toISOString().split('T')[0],
      exitDate: trade.exitDate ? trade.exitDate.toISOString().split('T')[0] : undefined,
    } : {
      type: 'Long',
      status: 'Open',
      entryDate: new Date().toISOString().split('T')[0],
    },
  })

  const handleFormSubmit = async (data: TradeInput) => {
    setIsLoading(true)
    await onSubmit(data)
    setIsLoading(false)
    reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={handleClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gradient">
                  {isEditing ? 'Edit Trade' : 'Add New Trade'}
                </h2>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Coin Symbol
                    </label>
                    <input
                      type="text"
                      {...register('coin')}
                      className="glass-input uppercase"
                      placeholder="BTC"
                    />
                    {errors.coin && (
                      <p className="mt-1 text-sm text-red-400">{errors.coin.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Trade Type
                    </label>
                    <select {...register('type')} className="glass-input">
                      <option value="Long">Long</option>
                      <option value="Short">Short</option>
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-400">{errors.type.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Entry Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('entryPrice', { valueAsNumber: true })}
                      className="glass-input"
                      placeholder="0.00"
                    />
                    {errors.entryPrice && (
                      <p className="mt-1 text-sm text-red-400">{errors.entryPrice.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Exit Price (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('exitPrice', { 
                        setValueAs: (v) => v === '' ? null : parseFloat(v) 
                      })}
                      className="glass-input"
                      placeholder="0.00"
                    />
                    {errors.exitPrice && (
                      <p className="mt-1 text-sm text-red-400">{errors.exitPrice.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      {...register('quantity', { valueAsNumber: true })}
                      className="glass-input"
                      placeholder="0.00"
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-400">{errors.quantity.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Status
                    </label>
                    <select {...register('status')} className="glass-input">
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    {errors.status && (
                      <p className="mt-1 text-sm text-red-400">{errors.status.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Entry Date
                    </label>
                    <input
                      type="date"
                      {...register('entryDate')}
                      className="glass-input"
                    />
                    {errors.entryDate && (
                      <p className="mt-1 text-sm text-red-400">{errors.entryDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Exit Date (Optional)
                    </label>
                    <input
                      type="date"
                      {...register('exitDate', {
                        setValueAs: (v) => v === '' ? null : v
                      })}
                      className="glass-input"
                    />
                    {errors.exitDate && (
                      <p className="mt-1 text-sm text-red-400">{errors.exitDate.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    {...register('notes')}
                    className="glass-input min-h-[100px] resize-none"
                    placeholder="Add your trade notes here..."
                  />
                  {errors.notes && (
                    <p className="mt-1 text-sm text-red-400">{errors.notes.message}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-2 px-4 rounded-lg border border-white/10 hover:bg-zinc-800/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 glow-button flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>{isEditing ? 'Update Trade' : 'Add Trade'}</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

