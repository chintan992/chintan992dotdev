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
    <section className="relative w-full overflow-hidden pt-6 pb-16 sm:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Full-bleed Editorial Lead Frame */}
        <div className="relative w-full h-[54vh] min-h-[400px] max-h-[580px] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-white/[0.08]">
          <img
            src="/media/photos/CHR07389.jpg"
            alt="City twilight and mountain atmosphere in Calgary by Chintan Rathod"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1920}
            height={1080}
          />

          {/* Vignette Gradients for Legibility & Deep Basalt Canvas Transition */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d0e] via-[#0c0d0e]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d0e]/85 via-[#0c0d0e]/40 to-transparent" />

          {/* Canvas Typography */}
          <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e2a868]" />
                <span>Calgary, Alberta · Software Engineering & Documentary Cinematography</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight font-display text-white leading-[1.12]">
                Architecting resilient digital systems and framing quiet human stories.
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 max-w-xl leading-relaxed">
                Building reactive web platforms, Android runtimes with Kotlin, and edge cloud infrastructure, alongside documentary photography across the Canadian Rockies.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Grounded Practice & Specs Bar */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-zinc-300">
            <span className="text-white font-medium">Compugen Systems</span>
            <span className="text-zinc-600 hidden sm:inline">/</span>
            <span>Former 7-Engineer AI Delivery Lead</span>
            <span className="text-zinc-600 hidden sm:inline">/</span>
            <span className="text-zinc-400">TypeScript · Kotlin · Flutter · Cloudflare</span>
          </div>

          <div className="flex items-center gap-4 shrink-0 pt-2 md:pt-0">
            <button
              onClick={() => onSelectMode('developer')}
              className="text-white hover:text-[#e2a868] flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-medium"
            >
              <span>Explore engineering</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenGallery}
              className="text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-medium"
            >
              <span>View photo gallery</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
