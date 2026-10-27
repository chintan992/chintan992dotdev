import { motion } from 'framer-motion'
import {
  Code2,
  Film,
  ArrowUpRight,
  Terminal as TerminalIcon,
  Camera,
  Cpu,
} from 'lucide-react'
import type { PortfolioMode } from '@/data/portfolio-data'
import { projects } from '@/data/portfolio-data'

interface ExecutiveBentoProps {
  onSelectMode: (mode: PortfolioMode) => void
  onOpenTerminal: () => void
  onOpenGallery: () => void
}

export default function ExecutiveBento({
  onSelectMode,
  onOpenTerminal,
  onOpenGallery,
}: ExecutiveBentoProps) {
  const featuredProject = projects[0] // Let's Stream

  const impactMetrics = [
    { label: 'Pilot Performance Lift', value: '15%', desc: 'Education AI solution' },
    { label: 'User Engagement Surge', value: '+28%', desc: 'Pilot deployment metric' },
    { label: 'Engineering Leadership', value: '7 Engineers', desc: 'Cross-functional delivery' },
    { label: 'Production Runtimes', value: 'Web + Mobile', desc: 'TypeScript, Kotlin, Cloud' },
  ]

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16">
      {/* Editorial Hero Statement */}
      <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-slate-300 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Full-Stack Technologist & Cinematic Director</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight font-display text-white leading-[1.15]">
            Architecting resilient digital systems.{' '}
            <span className="serif-italic-accent block text-slate-300 font-normal mt-2 sm:mt-1">
              Framing light, stillness & human stories.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-400 font-sans leading-relaxed pt-2">
            Dual-discipline engineer and visual storyteller based in Calgary. Building reactive web
            platforms, Kotlin runtimes, and commercial cinematic campaigns with uncompromising craft.
          </p>
        </motion.div>

        {/* Impact Metrics Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 pt-6 max-w-4xl mx-auto"
        >
          {impactMetrics.map((metric, i) => (
            <div
              key={i}
              className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] backdrop-blur-md text-left transition-all hover:border-white/[0.15] hover:bg-white/[0.04]"
            >
              <div className="text-xl sm:text-3xl font-black font-display text-white tracking-tight">
                {metric.value}
              </div>
              <div className="text-xs font-bold text-slate-200 mt-0.5">{metric.label}</div>
              <div className="text-[10px] sm:text-[11px] font-mono text-slate-500 mt-0.5">{metric.desc}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bento Grid Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Card 1: Featured Software Architecture (Span 7) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-7 titanium-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col justify-between group relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 sm:pb-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-white">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Featured Application</div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white">{featuredProject.name}</h3>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono shrink-0">
                PWA Platform
              </span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-4 sm:mt-5">
              {featuredProject.description} Engineered with real-time state synchronization, PWA caching, and responsive media delivery pipelines.
            </p>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4 sm:mt-5">
              {featuredProject.stack.map((tag) => (
                <span
                  key={tag}
                  className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] sm:text-xs font-mono text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-white/[0.08] flex items-center justify-between">
            <button
              onClick={() => onSelectMode('developer')}
              className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explore all engineering projects</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </button>
            <a
              href={featuredProject.github}
              target="_blank"
              rel="noreferrer noopener"
              className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:border-white/30 text-white transition-all"
              aria-label="View Source Code"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Card 2: Cinematic Reel & Video (Span 5) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-5 titanium-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col justify-between group relative overflow-hidden"
        >
          {/* Video preview container */}
          <div className="relative w-full aspect-video max-h-56 rounded-2xl overflow-hidden border border-white/[0.1] bg-black/60 mb-5">
            <video
              src="/media/videos/model-car.mp4"
              poster="/media/thumbnails/model-car.jpg"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>4K 24fps · Cinematic Grade</span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 text-xs font-medium text-white line-clamp-1">
              Automotive silhouettes & urban cadence
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Film className="w-4 h-4 text-amber-400" />
              <h3 className="text-lg font-bold font-display text-white">Cinematic Direction</h3>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Commercial promos, short films, and documentary photography. Framing Canadian landscapes and editorial human moments.
            </p>
          </div>

          <div className="pt-5 mt-5 border-t border-white/[0.08] flex items-center justify-between">
            <button
              onClick={onOpenGallery}
              className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View curated gallery (20 frames)</span>
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={() => onSelectMode('visual')}
              className="px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-mono text-white hover:bg-white/[0.1] transition-all cursor-pointer"
            >
              Visual Hub
            </button>
          </div>
        </motion.div>

        {/* Card 3: Technical Capabilities & Disciplines (Span 4) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="md:col-span-4 titanium-card rounded-3xl p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-sky-400" />
              <h3 className="text-base font-bold font-display text-white">Core Engineering Stack</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Primary Languages</div>
                <div className="text-slate-200 font-medium mt-0.5">TypeScript · Kotlin · Dart · Python</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Frameworks & Mobile</div>
                <div className="text-slate-200 font-medium mt-0.5">React 19 · Flutter · Android SDK · Vite</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Cloud & Runtimes</div>
                <div className="text-slate-200 font-medium mt-0.5">Cloudflare Workers · Node.js · Firebase</div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.08]">
            <a
              href="#services"
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Technical service offerings</span> →
            </a>
          </div>
        </motion.div>

        {/* Card 4: Equipment & Film Toolkit (Span 4) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-4 titanium-card rounded-3xl p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Camera className="w-4 h-4 text-amber-300" />
              <h3 className="text-base font-bold font-display text-white">Cinematography Toolkit</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Camera Bodies</div>
                <div className="text-slate-200 font-medium mt-0.5">Sony Alpha Mirrorless 4K HDR Series</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Glass & Optics</div>
                <div className="text-slate-200 font-medium mt-0.5">24-70mm f/2.8 GM · 35mm f/1.4 · 85mm Prime</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Gimbal & Aerial</div>
                <div className="text-slate-200 font-medium mt-0.5">DJI RS3 Pro · DJI Mini 4 Pro Drone</div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.08]">
            <a
              href="#visual-offerings"
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View full gear locker</span> →
            </a>
          </div>
        </motion.div>

        {/* Card 5: Interactive Terminal Teaser (Span 4) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="md:col-span-4 titanium-card rounded-3xl p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold font-display text-white">CLI Console</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-[11px] text-slate-300 space-y-1.5">
              <div className="text-slate-500">$ cr profile --summary</div>
              <div className="text-emerald-400">» Systems Engineer & Director</div>
              <div className="text-slate-400">» Type &apos;help&apos; for interactive commands</div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.08]">
            <button
              onClick={onOpenTerminal}
              className="w-full py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-mono text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Launch Terminal Session</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
