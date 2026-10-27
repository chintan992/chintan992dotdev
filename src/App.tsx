import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PortfolioMode, Service } from '@/data/portfolio-data'
import { devServices } from '@/data/portfolio-data'

// Components
import CursorCanvas from '@/components/CursorCanvas'
import NavigationHeader from '@/components/NavigationHeader'
import ExecutiveBento from '@/components/ExecutiveBento'
import Terminal from '@/components/Terminal'
import GitHubGrid from '@/components/GitHubGrid'
import CareerTimeline from '@/components/CareerTimeline'
import MasonryGallery from '@/components/MasonryGallery'
import VisualServices from '@/components/VisualServices'
import InquiryWizard from '@/components/InquiryWizard'

// Icons
import {
  Terminal as TerminalIcon,
  Sparkles,
  MapPin,
  Cpu,
  ArrowDown,
  Film,
  Mail,
} from 'lucide-react'

const CURRENT_YEAR = new Date().getFullYear()

export default function App() {
  const [mode, setMode] = useState<PortfolioMode>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase()
      if (hash === '#developer' || hash === '#dev') return 'developer'
      if (hash === '#visual' || hash === '#media') return 'visual'
    }
    return 'hub'
  })

  const [showTerminal, setShowTerminal] = useState(false)
  const mainContentRef = useRef<HTMLDivElement>(null)

  // Sync mode with window location hash
  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash.toLowerCase()
      if (hash === '#developer' || hash === '#dev') {
        setMode('developer')
      } else if (hash === '#visual' || hash === '#media') {
        setMode('visual')
      } else if (hash === '' || hash === '#hub' || hash === '#all') {
        setMode('hub')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  function switchMode(newMode: PortfolioMode) {
    setMode(newMode)
    if (newMode === 'hub') {
      window.history.pushState(null, '', '#all')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (newMode === 'developer') {
      window.history.pushState(null, '', '#dev')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (newMode === 'visual') {
      window.history.pushState(null, '', '#visual')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative min-h-screen text-slate-100 font-sans bg-[#08090a]">
      {/* Ambient Titanium Cursor Canvas */}
      <CursorCanvas mode={mode} />

      {/* Unified Executive Navigation Bar */}
      <NavigationHeader
        mode={mode}
        onModeChange={switchMode}
        showTerminal={showTerminal}
        onToggleTerminal={() => setShowTerminal(!showTerminal)}
      />

      {/* Slide-down Interactive CLI Terminal */}
      <AnimatePresence>
        {showTerminal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-white/[0.1] bg-[#0c0e12]/95 backdrop-blur-2xl z-40 relative overflow-hidden"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
                  <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Interactive Systems Command Line</span>
                </span>
                <button
                  onClick={() => setShowTerminal(false)}
                  className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer px-2 py-0.5 rounded bg-white/[0.04]"
                >
                  Close [Esc]
                </button>
              </div>
              <Terminal />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main ref={mainContentRef} className="relative z-10">
        <AnimatePresence mode="wait">
          {/* ================================================================= */}
          {/* 1. UNIFIED EXECUTIVE BENTO VIEW (#all / #hub)                      */}
          {/* ================================================================= */}
          {mode === 'hub' && (
            <motion.div
              key="hub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-12 sm:space-y-20"
            >
              {/* Executive Bento Hero Showcase */}
              <ExecutiveBento
                onSelectMode={switchMode}
                onOpenTerminal={() => setShowTerminal(true)}
                onOpenGallery={() => {
                  const el = document.getElementById('hub-gallery')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
              />

              {/* Section 1: Live GitHub & Systems Architecture */}
              <section id="projects" className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
                <GitHubGrid />
              </section>

              {/* Section 2: Career & Impact Trajectory */}
              <section id="trajectory" className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
                <div className="mb-10 text-center max-w-xl mx-auto">
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Experience & Milestones
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                    Trajectory & <span className="serif-italic-accent font-normal text-slate-300">Engineering Impact</span>
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    Deploying AI/ML solutions, architecting enterprise integrations, and steering technical delivery.
                  </p>
                </div>
                <CareerTimeline />
              </section>

              {/* Section 3: Curated Visual Masonry Gallery */}
              <section id="hub-gallery" className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
                <MasonryGallery />
              </section>

              {/* Section 4: Technical & Creative Offerings */}
              <section id="services" className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
                <div className="mb-10 text-center max-w-xl mx-auto">
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Disciplines & Toolkit
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                    Service Capabilities & <span className="serif-italic-accent font-normal text-slate-300">Philosophy</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {devServices.map((service: Service) => (
                    <div
                      key={service.title}
                      className="titanium-card p-8 rounded-3xl flex flex-col justify-between group"
                    >
                      <div>
                        <div className="text-2xl mb-4 p-3 rounded-2xl bg-white/[0.04] w-fit border border-white/[0.08] text-white">
                          {service.icon}
                        </div>
                        <h3 className="text-xl font-bold font-display text-white mb-2">{service.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">{service.description}</p>
                      </div>
                      <div className="pt-4 border-t border-white/[0.08] space-y-2">
                        {service.details.map((detail: string) => (
                          <div key={detail} className="text-xs font-mono text-slate-300 flex items-center gap-2">
                            <span className="text-slate-400">›</span> {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Visual Services & Gear Locker */}
                <VisualServices />
              </section>

              {/* Section 5: Direct Inquiry / Contact Wizard */}
              <section id="inquiry" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                    <Mail className="w-3.5 h-3.5 text-slate-300" /> Start An Engagement
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                    Let&apos;s Build Something <span className="serif-italic-accent font-normal text-slate-300">Enduring</span>
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    Have a systems challenge, software product, or cinematic commission in mind?
                  </p>
                </div>
                <InquiryWizard mode="developer" />
              </section>
            </motion.div>
          )}

          {/* ================================================================= */}
          {/* 2. DEDICATED DEVELOPER / SYSTEMS VIEW (#dev)                       */}
          {/* ================================================================= */}
          {mode === 'developer' && (
            <motion.div
              key="developer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-16 py-8"
            >
              {/* Focused Developer Hero */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-slate-300 text-xs font-mono">
                      <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Senior Product Engineer · Systems Architect</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white leading-[1.1]">
                      Building reactive web platforms & <span className="serif-italic-accent font-normal text-slate-300">high-performance runtimes.</span>
                    </h1>

                    <p className="text-slate-300 text-base leading-relaxed max-w-xl">
                      Crafting resilient digital products with TypeScript, Kotlin, Flutter, and edge cloud infrastructure. Driven by architectural clarity, sub-second latency, and scalable business value.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <a
                        href="#dev-projects"
                        className="px-6 py-3 rounded-full bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2 cursor-pointer"
                      >
                        Explore Projects <ArrowDown className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => setShowTerminal(true)}
                        className="px-6 py-3 rounded-full bg-white/[0.04] border border-white/[0.1] text-white font-mono text-xs hover:border-white/30 hover:bg-white/[0.08] transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" /> Open Terminal CLI
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    {/* Titanium HUD Card */}
                    <div className="titanium-card p-6 sm:p-7 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span>ENGINEERING TELEMETRY</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">v3.0.0</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="text-slate-400 text-[10px]">PRIMARY STACK</div>
                          <div className="text-white font-bold mt-1">TypeScript · Kotlin</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="text-slate-400 text-[10px]">MOBILE ENGINES</div>
                          <div className="text-white font-bold mt-1">Android · Flutter</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="text-slate-400 text-[10px]">CLOUD RUNTIME</div>
                          <div className="text-white font-bold mt-1">Cloudflare · Node</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="text-slate-400 text-[10px]">LOCATION</div>
                          <div className="text-white font-bold mt-1">Calgary, Canada</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-slate-300">
                        <span className="text-emerald-400">&gt;</span> Available for architecture reviews, full-stack builds & mobile app engineering.
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Projects Grid */}
              <section id="dev-projects" className="max-w-6xl mx-auto px-4 sm:px-6">
                <GitHubGrid />
              </section>

              {/* Career Timeline */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="mb-10 text-center max-w-xl mx-auto">
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Milestones
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                    Trajectory & <span className="serif-italic-accent font-normal text-slate-300">Engineering Impact</span>
                  </h2>
                </div>
                <CareerTimeline />
              </section>

              {/* Capabilities */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="mb-10">
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Core Offerings
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                    Technical Service Disciplines
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {devServices.map((service: Service) => (
                    <div
                      key={service.title}
                      className="titanium-card p-8 rounded-3xl flex flex-col justify-between group"
                    >
                      <div>
                        <div className="text-2xl mb-4 p-3 rounded-2xl bg-white/[0.04] w-fit border border-white/[0.08] text-white">
                          {service.icon}
                        </div>
                        <h3 className="text-xl font-bold font-display text-white mb-2">{service.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">{service.description}</p>
                      </div>
                      <div className="pt-4 border-t border-white/[0.08] space-y-2">
                        {service.details.map((detail: string) => (
                          <div key={detail} className="text-xs font-mono text-slate-300 flex items-center gap-2">
                            <span className="text-slate-400">›</span> {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Contact Wizard */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                    Start a Technical Conversation
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    Have a product roadmap, app idea, or systems challenge? Send over the details below.
                  </p>
                </div>
                <InquiryWizard mode="developer" />
              </section>
            </motion.div>
          )}

          {/* ================================================================= */}
          {/* 3. DEDICATED VISUAL / CINEMATIC VIEW (#visual)                     */}
          {/* ================================================================= */}
          {mode === 'visual' && (
            <motion.div
              key="visual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-16 py-8"
            >
              {/* Focused Visual Hero */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-10 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-amber-300/90 text-xs font-mono mb-6">
                  <Film className="w-3.5 h-3.5" />
                  <span>Cinematic Filmmaking · Documentary Photography</span>
                </div>

                <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-display text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
                  Light, stillness, and human moments{' '}
                  <span className="serif-italic-accent font-normal text-slate-300 block mt-2">
                    framed with purpose.
                  </span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mt-6">
                  Based in Calgary, capturing the Canadian wilderness, editorial portraits, and cinematic brand stories. Every frame is treated with intentional color rhythm and organic texture.
                </p>

                <div className="flex justify-center items-center gap-4 mt-8">
                  <a
                    href="#visual-gallery"
                    className="px-7 py-3 rounded-full bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] flex items-center gap-2 cursor-pointer"
                  >
                    View Gallery <ArrowDown className="w-4 h-4" />
                  </a>
                  <a
                    href="#visual-inquiry"
                    className="px-6 py-3 rounded-full bg-white/[0.04] border border-white/[0.1] text-white font-mono text-xs hover:border-white/30 hover:bg-white/[0.08] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Book Shoot Session
                  </a>
                </div>
              </section>

              {/* Masonry Gallery */}
              <section id="visual-gallery" className="max-w-6xl mx-auto px-4 sm:px-6">
                <MasonryGallery />
              </section>

              {/* Offerings & Gear */}
              <section id="visual-offerings" className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-300/80 uppercase tracking-wider mb-2">
                    <Film className="w-3.5 h-3.5" /> Creative Suite
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                    Cinematic Production & <span className="serif-italic-accent font-normal text-slate-300">Toolkit</span>
                  </h2>
                </div>
                <VisualServices />
              </section>

              {/* Booking Inquiry */}
              <section id="visual-inquiry" className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                    Commission A Shoot or Production
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    Currently booking creative brand campaigns, commercial assignments, and editorial portraits.
                  </p>
                </div>
                <InquiryWizard mode="visual" defaultService="Videography" />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Universal Minimalist Executive Footer */}
      <footer className="border-t border-white/[0.08] py-12 mt-20 text-xs font-mono text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-white text-sm">Chintan Rathod</span>
            <span className="text-slate-600">/</span>
            <span>© {CURRENT_YEAR} · Built with React & Cloudflare</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => switchMode(mode === 'developer' ? 'visual' : 'developer')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {mode === 'developer'
                ? 'Switch to Cinematography Perspective →'
                : 'Switch to Software Architecture Perspective →'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
