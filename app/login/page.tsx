import AuthForm from '@/components/AuthForm'
import { TrendingUp } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">CryptoJournal</h2>
          <p className="text-xs text-zinc-400">Professional Trading Analytics</p>
        </div>
      </div>
      <AuthForm mode="login" />
    </div>
  )
}

