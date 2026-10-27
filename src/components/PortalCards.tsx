import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useMousePosition } from '@/hooks/useMousePosition'
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation'
import { cn } from '@/lib/utils'
import { Code2, Camera } from 'lucide-react'
import type { PortfolioMode } from '@/data/portfolio-data'

interface PortalCardsProps {
  onSelect: (mode: Exclude<PortfolioMode, 'hub'>) => void
}

export default function PortalCards({ onSelect }: PortalCardsProps) {
  const mouse = useMousePosition()
  const orientation = useDeviceOrientation()
  const containerRef = useRef<HTMLDivElement>(null)

  function getTransform(cardIndex: number) {
    if (orientation.supported) {
      const tiltX = orientation.gamma * 0.4
      const tiltY = orientation.beta * 0.3
      return {
        rotateX: -tiltY,
        rotateY: tiltX * (cardIndex === 0 ? 1 : -1),
      }
    }
    return {
      rotateX: -mouse.normalizedY * 12,
      rotateY: mouse.normalizedX * 12 * (cardIndex === 0 ? 1 : -1),
    }
  }

  const devTransform = getTransform(0)
  const visualTransform = getTransform(1)

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full max-w-5xl mx-auto px-6" style={{ perspective: '1200px' }}>
      {/* Developer Card */}
      <motion.button
        className={cn(
          'group relative flex flex-col items-center justify-center gap-6',
          'min-h-[340px] md:min-h-[420px] p-8 md:p-12 rounded-2xl',
          'bg-gradient-to-br from-[#0a0f0d] via-[#111513] to-[#0d1117]',
          'border border-[#00ff9d]/20 hover:border-[#00ff9d]/50',
          'cursor-pointer overflow-hidden transition-colors duration-500',
          'shadow-[0_0_60px_rgba(0,255,157,0.08)] hover:shadow-[0_0_80px_rgba(0,255,157,0.2)]',
        )}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateX: devTransform.rotateX,
          rotateY: devTransform.rotateY,
        }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        whileHover={{ scale: 1.03, z: 30 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelect('developer')}
      >
        {/* Scanline overlay */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,157,0.03)_2px,rgba(0,255,157,0.03)_4px)] pointer-events-none" />

        {/* Animated glow border */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[conic-gradient(from_0deg,transparent,#00ff9d,transparent,#3857ef,transparent)] p-[1px]">
          <div className="absolute inset-[1px] rounded-2xl bg-[#0a0f0d]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-5" style={{ transform: 'translateZ(40px)' }}>
          <div className="w-16 h-16 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center group-hover:bg-[#00ff9d]/20 group-hover:border-[#00ff9d]/50 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(0,255,157,0.3)]">
            <Code2 className="w-8 h-8 text-[#00ff9d]" />
          </div>

          <div className="text-center">
            <p className="text-[#00ff9d]/60 text-xs font-mono tracking-[0.2em] uppercase mb-2">01 — Enter</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-display">
              Developer
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-[240px] leading-relaxed">
              Code, systems & products — the engineering side of things.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#00ff9d]/50 group-hover:text-[#00ff9d]/80 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
            <span>{'>'} cd /developer</span>
          </div>
        </div>

        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(0,255,157,1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      </motion.button>

      {/* Visual/Media Card */}
      <motion.button
        className={cn(
          'group relative flex flex-col items-center justify-center gap-6',
          'min-h-[340px] md:min-h-[420px] p-8 md:p-12 rounded-2xl',
          'bg-gradient-to-br from-[#1a1815] via-[#252220] to-[#1e1b18]',
          'border border-[#c8a45c]/20 hover:border-[#c8a45c]/50',
          'cursor-pointer overflow-hidden transition-colors duration-500',
          'shadow-[0_0_60px_rgba(200,164,92,0.06)] hover:shadow-[0_0_80px_rgba(200,164,92,0.15)]',
        )}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateX: visualTransform.rotateX,
          rotateY: visualTransform.rotateY,
        }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        whileHover={{ scale: 1.03, z: 30 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelect('visual')}
      >
        {/* Film grain overlay */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC43IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMC4zIi8+PC9zdmc+')]" />

        {/* Animated glow border */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[conic-gradient(from_180deg,transparent,#c8a45c,transparent,#d4a853,transparent)] p-[1px]">
          <div className="absolute inset-[1px] rounded-2xl bg-[#1a1815]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-5" style={{ transform: 'translateZ(40px)' }}>
          <div className="w-16 h-16 rounded-xl bg-[#c8a45c]/10 border border-[#c8a45c]/30 flex items-center justify-center group-hover:bg-[#c8a45c]/20 group-hover:border-[#c8a45c]/50 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(200,164,92,0.25)]">
            <Camera className="w-8 h-8 text-[#c8a45c]" />
          </div>

          <div className="text-center">
            <p className="text-[#c8a45c]/60 text-xs font-mono tracking-[0.2em] uppercase mb-2">02 — Enter</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-display">
              Visual Artist
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-[240px] leading-relaxed">
              Photography, films & visual storytelling — the cinematic lens.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#c8a45c]/50 group-hover:text-[#c8a45c]/80 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#c8a45c] animate-pulse" />
            <span>◉ Open gallery</span>
          </div>
        </div>

        {/* Viewfinder corners */}
        <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-[#c8a45c]/30 group-hover:border-[#c8a45c]/60 transition-colors" />
        <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-[#c8a45c]/30 group-hover:border-[#c8a45c]/60 transition-colors" />
        <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-[#c8a45c]/30 group-hover:border-[#c8a45c]/60 transition-colors" />
        <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-[#c8a45c]/30 group-hover:border-[#c8a45c]/60 transition-colors" />
      </motion.button>
    </div>
  )
}
