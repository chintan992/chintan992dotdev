import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PortfolioMode, Service } from '@/data/portfolio-data'
import { devServices } from '@/data/portfolio-data'

// Components
import NavigationHeader from '@/components/NavigationHeader'
import EditorialHero from '@/components/EditorialHero'
import GitHubGrid from '@/components/GitHubGrid'
import CareerTimeline from '@/components/CareerTimeline'
import MasonryGallery from '@/components/MasonryGallery'
import VisualServices from '@/components/VisualServices'
import InquiryWizard from '@/components/InquiryWizard'

// Icons
import {
  MapPin,
  Cpu,
  ArrowDown,
  Film,
  ArrowRight,
} from 'lucide-react'

const CURRENT_YEAR = new Date().getFullYear()

export default function App() {
  const [mode, setMode] = useState<PortfolioMode>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase()
      if (path.startsWith('/developer') || path.startsWith('/dev') || path.startsWith('/engineering')) {
        return 'developer'
      }
      if (path.startsWith('/visual') || path.startsWith('/photography') || path.startsWith('/film')) {
        return 'visual'
      }

      const hash = window.location.hash.toLowerCase()
      if (hash === '#developer' || hash === '#dev') return 'developer'
      if (hash === '#visual' || hash === '#media') return 'visual'
    }
    return 'hub'
  })

  // Sync mode with window location and update document title
  useEffect(() => {
    function handleLocationChange() {
      const path = window.location.pathname.toLowerCase()
      if (path.startsWith('/developer') || path.startsWith('/dev') || path.startsWith('/engineering')) {
        setMode('developer')
        return
      }
      if (path.startsWith('/visual') || path.startsWith('/photography') || path.startsWith('/film')) {
        setMode('visual')
        return
      }

      const hash = window.location.hash.toLowerCase()
      if (hash === '#developer' || hash === '#dev') {
        setMode('developer')
      } else if (hash === '#visual' || hash === '#media') {
        setMode('visual')
      } else if (hash === '' || hash === '#hub' || hash === '#all') {
        setMode('hub')
      }
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)
    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  // Dynamic intent-specific page titles
  useEffect(() => {
    if (mode === 'developer') {
      document.title = 'Software Engineering — Chintan Rathod | Calgary'
    } else if (mode === 'visual') {
      document.title = 'Photography & Cinematography — Chintan Rathod | Calgary'
    } else {
      document.title = 'Chintan Rathod — Software Engineer & Photographer, Calgary'
    }
  }, [mode])

  function switchMode(newMode: PortfolioMode) {
    setMode(newMode)
    const targetPath = newMode === 'hub' ? '/' : `/${newMode}`
    window.history.pushState(null, '', targetPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen text-slate-100 font-sans bg-[#08090a]">
      {/* Unified Navigation Bar */}
      <NavigationHeader
        mode={mode}
        onModeChange={switchMode}
      />

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {/* ================================================================= */}
          {/* 1. EDITORIAL OVERVIEW VIEW (#all / #hub)                           */}
          {/* ================================================================= */}
          {mode === 'hub' && (
            <motion.div
              key="hub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-16 sm:space-y-24"
            >
              {/* Editorial Hero Showcase */}
              <EditorialHero
                onSelectMode={switchMode}
                onOpenGallery={() => {
                  const el = document.getElementById('hub-gallery')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
              />

              {/* Curated Visual Gallery */}
              <section id="hub-gallery" className="max-w-6xl mx-auto px-4 sm:px-6">
                <MasonryGallery />
              </section>

              {/* Core Disciplines & Technical Philosophy (Dense list layout, no icon cards) */}
              <section id="services" className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-8">
                  <div>
                    <p className="text-xs font-mono tracking-wider text-slate-400 uppercase mb-1.5">
                      Practice & Capabilities
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-medium font-display tracking-tight text-white">
                      Disciplines & Craft
                    </h2>
                  </div>
                  <button
                    onClick={() => switchMode('developer')}
                    className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View all engineering work</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Plain, dense list format per audit recommendation */}
                <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
                  {devServices.map((service: Service) => (
                    <div
                      key={service.title}
                      className="py-6 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-baseline"
                    >
                      <div className="md:col-span-4">
                        <h3 className="text-lg font-medium font-display text-white">
                          {service.title}
                        </h3>
                      </div>
                      <div className="md:col-span-8 space-y-3">
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-slate-400">
                          {service.details.map((detail: string) => (
                            <span key={detail} className="flex items-center gap-1.5">
                              <span className="text-slate-500">·</span>
                              <span>{detail}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Direct Inquiry / Contact */}
              <section id="inquiry" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                    Inquiries & Collaborations
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-medium font-display text-white tracking-tight">
                    Start a Conversation
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    Have a systems architecture challenge, software product, or visual assignment in mind?
                  </p>
                </div>
                <InquiryWizard mode="hub" />
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
              transition={{ duration: 0.35 }}
              className="space-y-16 py-8"
            >
              {/* Focused Developer Hero */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs font-mono">
                      <Cpu className="w-3.5 h-3.5 text-slate-400" />
                      <span>Software Engineering & Systems Architecture</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-medium font-display tracking-tight text-white leading-[1.15]">
                      Building reactive web platforms & high-performance runtimes.
                    </h1>

                    <p className="text-slate-300 text-base leading-relaxed max-w-xl">
                      Crafting resilient digital products with TypeScript, Kotlin, Flutter, and edge cloud infrastructure. Driven by architectural clarity, sub-second latency, and scalable business value.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <a
                        href="#dev-projects"
                        className="px-6 py-2.5 rounded-full bg-white text-black font-mono font-medium text-xs uppercase tracking-wider hover:bg-slate-200 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        Explore Projects <ArrowDown className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    {/* Technical Profile Card */}
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                        <span className="text-xs font-mono text-slate-300">TECHNICAL PROFILE</span>
                        <span className="text-xs font-mono text-slate-400">Calgary, Canada</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="text-slate-400 text-[10px]">PRIMARY STACK</div>
                          <div className="text-white font-medium mt-1">TypeScript · Kotlin</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="text-slate-400 text-[10px]">MOBILE ENGINES</div>
                          <div className="text-white font-medium mt-1">Android · Flutter</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="text-slate-400 text-[10px]">CLOUD RUNTIME</div>
                          <div className="text-white font-medium mt-1">Cloudflare · Node</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="text-slate-400 text-[10px]">ORGANIZATION</div>
                          <div className="text-white font-medium mt-1">Compugen</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-slate-300">
                        Available for architecture reviews, full-stack builds, and mobile systems engineering.
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Projects Grid (Live once in developer mode) */}
              <section id="dev-projects" className="max-w-6xl mx-auto px-4 sm:px-6">
                <GitHubGrid />
              </section>

              {/* Career Timeline (Live once in developer mode) */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="mb-8">
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Milestones & Experience
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-medium font-display text-white tracking-tight">
                    Trajectory & Engineering Delivery
                  </h2>
                </div>
                <CareerTimeline />
              </section>

              {/* Technical Service Disciplines */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="mb-8">
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Engineering Services
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-medium font-display text-white tracking-tight">
                    Technical Disciplines
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {devServices.map((service: Service) => (
                    <div
                      key={service.title}
                      className="p-6 sm:p-7 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-2xl mb-4 p-2.5 rounded-xl bg-white/[0.04] w-fit border border-white/[0.06] text-white">
                          {service.icon}
                        </div>
                        <h3 className="text-lg font-medium font-display text-white mb-2">{service.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">{service.description}</p>
                      </div>
                      <div className="pt-4 border-t border-white/[0.06] space-y-2">
                        {service.details.map((detail: string) => (
                          <div key={detail} className="text-xs font-mono text-slate-300 flex items-center gap-2">
                            <span className="text-slate-500">›</span> {detail}
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
                  <h2 className="text-2xl sm:text-3xl font-medium font-display text-white tracking-tight">
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
              transition={{ duration: 0.35 }}
              className="space-y-16 py-8"
            >
              {/* Focused Visual Hero */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-10 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs font-mono mb-6">
                  <Film className="w-3.5 h-3.5 text-slate-400" />
                  <span>Cinematic Filmmaking · Documentary Photography</span>
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium font-display text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
                  Light, stillness, and human moments framed with purpose.
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mt-6">
                  Based in Calgary, capturing the Canadian wilderness, editorial portraits, and cinematic brand stories. Every frame is treated with intentional color rhythm and organic texture.
                </p>

                <div className="flex justify-center items-center gap-4 mt-8">
                  <a
                    href="#visual-gallery"
                    className="px-6 py-2.5 rounded-full bg-white text-black font-mono font-medium text-xs uppercase tracking-wider hover:bg-slate-200 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    View Gallery <ArrowDown className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="#visual-inquiry"
                    className="px-6 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white font-mono text-xs hover:bg-white/[0.08] transition-all flex items-center gap-2 cursor-pointer"
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
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Creative Suite
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-medium font-display text-white tracking-tight">
                    Cinematic Production & Toolkit
                  </h2>
                </div>
                <VisualServices />
              </section>

              {/* Booking Inquiry */}
              <section id="visual-inquiry" className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <h2 className="text-2xl sm:text-3xl font-medium font-display text-white tracking-tight">
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

      {/* Minimalist Executive Footer */}
      <footer className="border-t border-white/[0.08] py-12 mt-20 text-xs font-mono text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-display font-medium text-white text-sm">Chintan Rathod</span>
            <span className="text-slate-600">/</span>
            <span>© {CURRENT_YEAR} · Calgary, Alberta</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => switchMode(mode === 'developer' ? 'visual' : 'developer')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {mode === 'developer'
                ? 'Switch to Cinematography Perspective →'
                : 'Switch to Software Engineering Perspective →'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
