import { motion } from 'framer-motion'
import { ArrowRight, ArrowDown } from 'lucide-react'
import type { PortfolioMode } from '@/data/portfolio-data'

interface EditorialHeroProps {
  onSelectMode: (mode: PortfolioMode) => void
  onOpenGallery: () => void
}

export default function EditorialHero({
  onSelectMode,
  onOpenGallery,
}: EditorialHeroProps) {
  return (
    <section className="relative w-full overflow-hidden pt-8 pb-16 sm:pb-24">
      {/* Editorial Visual Hero Frame */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative w-full h-[52vh] min-h-[380px] max-h-[560px] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-white/[0.08]">
          {/* Real Photography Lead Frame */}
          <img
            src="/media/photos/CHR07389.jpg"
            alt="City twilight and mountain atmosphere by Chintan Rathod"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1920}
            height={1080}
          />

          {/* Vignette Gradients for Legibility & Calm Mood */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090a] via-[#08090a]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08090a]/80 via-[#08090a]/30 to-transparent" />

          {/* Overlay Typography Directly on the Visual Canvas */}
          <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <p className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Chintan Rathod · Software Engineer & Photographer
              </p>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight font-display text-white leading-[1.1]">
                Architecting resilient digital systems.{' '}
                <span className="serif-italic-accent block text-slate-200 font-normal mt-1.5">
                  Framing light, stillness & human stories.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed pt-1">
                Based in Calgary, Alberta. Crafting reactive web platforms and mobile runtimes with TypeScript and Kotlin, alongside documentary photography across the Canadian Rockies.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Quiet Grounded Facts Line (No metric tiles, no marketing pills) */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-300">
            <span>Compugen Integration</span>
            <span className="text-slate-600">·</span>
            <span>Former 7-Engineer AI Delivery Lead</span>
            <span className="text-slate-600">·</span>
            <span>TypeScript · Kotlin · Flutter</span>
            <span className="text-slate-600">·</span>
            <span>Calgary, AB</span>
          </div>

          <div className="flex items-center gap-5 shrink-0 pt-2 md:pt-0">
            <button
              onClick={() => onSelectMode('developer')}
              className="text-white hover:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explore Engineering</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenGallery}
              className="text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Gallery</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
