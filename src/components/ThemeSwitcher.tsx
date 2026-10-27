import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Code2, Camera, ArrowLeftRight } from 'lucide-react'
import type { PortfolioMode } from '@/data/portfolio-data'

interface ThemeSwitcherProps {
  mode: PortfolioMode
  onModeChange: (mode: Exclude<PortfolioMode, 'hub'>) => void
  onReturnToHub: () => void
}

export default function ThemeSwitcher({ mode, onModeChange, onReturnToHub }: ThemeSwitcherProps) {
  if (mode === 'hub') return null

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.3 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className={cn(
        'flex items-center gap-1 p-1.5 rounded-full backdrop-blur-xl border',
        'shadow-2xl',
        mode === 'developer'
          ? 'bg-[#0a0f0d]/90 border-[#00ff9d]/20 shadow-[0_8px_32px_rgba(0,255,157,0.1)]'
          : 'bg-[#1a1815]/90 border-[#c8a45c]/20 shadow-[0_8px_32px_rgba(200,164,92,0.1)]',
      )}>
        <button
          onClick={() => onModeChange('developer')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
            mode === 'developer'
              ? 'bg-[#00ff9d]/15 text-[#00ff9d] shadow-[0_0_20px_rgba(0,255,157,0.15)]'
              : 'text-gray-400 hover:text-white',
          )}
          aria-pressed={mode === 'developer'}
        >
          <Code2 className="w-4 h-4" />
          <span className="hidden sm:inline">Dev</span>
        </button>

        <button
          onClick={onReturnToHub}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-full text-xs transition-all duration-300',
            mode === 'developer'
              ? 'text-gray-500 hover:text-[#00ff9d]/60'
              : 'text-gray-500 hover:text-[#c8a45c]/60',
          )}
          aria-label="Return to portal hub"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onModeChange('visual')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
            mode === 'visual'
              ? 'bg-[#c8a45c]/15 text-[#c8a45c] shadow-[0_0_20px_rgba(200,164,92,0.15)]'
              : 'text-gray-400 hover:text-white',
          )}
          aria-pressed={mode === 'visual'}
        >
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">Visual</span>
        </button>
      </div>
    </motion.div>
  )
}
