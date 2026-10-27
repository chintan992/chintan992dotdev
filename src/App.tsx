import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { PortfolioMode, Service } from '@/data/portfolio-data'
import { devServices } from '@/data/portfolio-data'

// Components
import CursorCanvas from '@/components/CursorCanvas'
import PortalCards from '@/components/PortalCards'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import Terminal from '@/components/Terminal'
import GitHubGrid from '@/components/GitHubGrid'
import CareerTimeline from '@/components/CareerTimeline'
import MasonryGallery from '@/components/MasonryGallery'
import VisualServices from '@/components/VisualServices'
import InquiryWizard from '@/components/InquiryWizard'
import SocialDock from '@/components/SocialDock'
import { InstagramIcon } from '@/components/Icons'

// Icons
import {
  Camera,
  Terminal as TerminalIcon,
  Sparkles,
  ArrowUpRight,
  Compass,
  FileText,
  MapPin,
  Cpu,
  Layers,
  ArrowDown,
  Film,
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
  const devTopRef = useRef<HTMLDivElement>(null)
  const visualTopRef = useRef<HTMLDivElement>(null)

  // Sync mode with window location hash
  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash.toLowerCase()
      if (hash === '#developer' || hash === '#dev') {
        setMode('developer')
      } else if (hash === '#visual' || hash === '#media') {
        setMode('visual')
      } else if (hash === '' || hash === '#hub') {
        setMode('hub')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  function switchMode(newMode: PortfolioMode) {
    setMode(newMode)
    if (newMode === 'hub') {
      window.history.pushState(null, '', '#hub')
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
    <div className="relative min-h-screen text-gray-100 selection:bg-[#00ff9d] selection:text-black font-sans bg-[#050706]">
      {/* Global Interactive Background Canvas */}
      <CursorCanvas />

      {/* Floating Social Dock */}
      <SocialDock mode={mode} />

      {/* Global Persona / Theme Switcher */}
      <ThemeSwitcher
        mode={mode}
        onModeChange={(m: Exclude<PortfolioMode, 'hub'>) => switchMode(m)}
        onReturnToHub={() => switchMode('hub')}
      />

      <AnimatePresence mode="wait">
        {/* ================================================================= */}
        {/* 1. INTERACTIVE ENTRY & NAVIGATION HUB                             */}
        {/* ================================================================= */}
        {mode === 'hub' && (
          <motion.main
            key="hub"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 min-h-screen flex flex-col justify-between items-center px-4 py-8 sm:py-12"
          >
            {/* Header Badge */}
            <div className="text-center pt-4 sm:pt-8 space-y-4">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-mono text-gray-300"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Calgary, Alberta · Available for Select Engagements</span>
              </motion.div>

              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-500">
                  Chintan Rathod
                </h1>
                <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-lg mx-auto font-sans">
                  Dual-discipline technologist and visual storyteller. Select a dimension below to enter.
                </p>
              </motion.div>
            </div>

            {/* Split 3D Interactive Portal Cards */}
            <div className="w-full my-8 sm:my-12">
              <PortalCards onSelect={(selected: Exclude<PortfolioMode, 'hub'>) => switchMode(selected)} />
            </div>

            {/* Hub Footer Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-xs font-mono text-gray-400 flex items-center gap-2 pb-2"
            >
              <Compass className="w-3.5 h-3.5 text-gray-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span>Hover cards for 3D parallax · Tilt device on mobile</span>
            </motion.div>
          </motion.main>
        )}

        {/* ================================================================= */}
        {/* 2. DEVELOPER PORTFOLIO (CYBERPUNK / HIGH CONTRAST)                */}
        {/* ================================================================= */}
        {mode === 'developer' && (
          <motion.div
            key="developer"
            ref={devTopRef}
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.4 }}
            className="relative z-10 min-h-screen text-gray-200"
          >
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#050706]/85 border-b border-[#00ff9d]/15">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <button
                  onClick={() => switchMode('hub')}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center text-[#00ff9d] font-mono font-bold text-sm group-hover:scale-105 transition-transform">
                    CR
                  </div>
                  <span className="font-mono text-xs text-gray-400 group-hover:text-[#00ff9d] transition-colors">
                    ~/chintan/dev
                  </span>
                </button>

                <nav className="hidden md:flex items-center gap-6 text-xs font-mono">
                  <a href="#dev-projects" className="text-gray-400 hover:text-[#00ff9d] transition-colors">
                    01. Repos & Apps
                  </a>
                  <a href="#dev-timeline" className="text-gray-400 hover:text-[#00ff9d] transition-colors">
                    02. Journey
                  </a>
                  <a href="#dev-services" className="text-gray-400 hover:text-[#00ff9d] transition-colors">
                    03. Capabilities
                  </a>
                  <a href="#dev-contact" className="text-gray-400 hover:text-[#00ff9d] transition-colors">
                    04. Terminal/Inquiry
                  </a>
                </nav>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowTerminal(!showTerminal)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-all cursor-pointer',
                      showTerminal
                        ? 'bg-[#00ff9d] text-black border-[#00ff9d]'
                        : 'bg-[#00ff9d]/10 text-[#00ff9d] border-[#00ff9d]/30 hover:bg-[#00ff9d]/20',
                    )}
                  >
                    <TerminalIcon className="w-3.5 h-3.5" />
                    <span>CLI</span>
                  </button>
                  <a
                    href="https://github.com/chintan992"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-1.5 rounded-lg border border-white/10 hover:border-[#00ff9d]/40 text-gray-300 hover:text-[#00ff9d] transition-all"
                    aria-label="GitHub Profile"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </header>

            {/* Developer Hero */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff9d]/10 border border-[#00ff9d]/30 text-[#00ff9d] text-xs font-mono">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Software Engineer · Systems Architect</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white leading-[1.1]">
                    Building reactive web platforms & high-performance Android apps.
                  </h1>

                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl">
                    I craft thoughtful digital experiences with modern web technologies, Kotlin, Flutter, and cloud runtimes. Driven by maintainable architectures, low-latency interfaces, and scalable business logic.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <a
                      href="#dev-projects"
                      className="px-6 py-3 rounded-full bg-[#00ff9d] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#33ffb0] transition-all shadow-[0_0_25px_rgba(0,255,157,0.3)] flex items-center gap-2 cursor-pointer"
                    >
                      Explore Projects <ArrowDown className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => setShowTerminal(true)}
                      className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-mono text-xs hover:border-[#00ff9d]/40 hover:bg-[#00ff9d]/5 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <TerminalIcon className="w-3.5 h-3.5 text-[#00ff9d]" /> Open Terminal
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  {/* System Overview HUD Card */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c120f] to-[#080b0a] border border-[#00ff9d]/25 shadow-[0_0_50px_rgba(0,255,157,0.08)] space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#00ff9d]/15">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#00ff9d]">
                        <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-ping" />
                        <span>ACTIVE TELEMETRY</span>
                      </div>
                      <span className="text-[11px] font-mono text-gray-500">v2.4.0</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                        <div className="text-gray-400 text-[10px]">PRIMARY STACK</div>
                        <div className="text-white font-bold mt-1">TypeScript · Kotlin</div>
                      </div>
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                        <div className="text-gray-400 text-[10px]">MOBILE TECH</div>
                        <div className="text-white font-bold mt-1">Flutter · Android SDK</div>
                      </div>
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                        <div className="text-gray-400 text-[10px]">CLOUD & RUNTIME</div>
                        <div className="text-white font-bold mt-1">Cloudflare · Node</div>
                      </div>
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                        <div className="text-gray-400 text-[10px]">LOCATION</div>
                        <div className="text-white font-bold mt-1">Calgary, Canada</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#00ff9d]/5 border border-[#00ff9d]/20 text-xs font-mono text-gray-300">
                      <span className="text-[#00ff9d]">&gt;</span> Available for full-stack engineering, performance audits, & mobile app development.
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Embedded Terminal Section */}
            <AnimatePresence>
              {showTerminal && (
                <motion.section
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="max-w-6xl mx-auto px-4 sm:px-6 mb-12 overflow-hidden"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-mono text-[#00ff9d] flex items-center gap-2">
                      <TerminalIcon className="w-3.5 h-3.5" /> Interactive Command Line Console
                    </span>
                    <button
                      onClick={() => setShowTerminal(false)}
                      className="text-xs font-mono text-gray-500 hover:text-white cursor-pointer"
                    >
                      Close [Esc]
                    </button>
                  </div>
                  <Terminal />
                </motion.section>
              )}
            </AnimatePresence>

            {/* Section 1: Live GitHub & Featured Projects */}
            <section id="dev-projects" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/5">
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00ff9d] uppercase tracking-wider mb-2">
                  <Layers className="w-3.5 h-3.5" /> Featured Codebases & Live Repos
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                  Engineered for Performance & Scale
                </h2>
                <p className="text-gray-400 text-sm mt-2 max-w-xl">
                  Live data synced directly with GitHub. Filter by stack or click any repository to examine code and commit history.
                </p>
              </div>
              <GitHubGrid />
            </section>

            {/* Section 2: Career & Impact Timeline */}
            <section id="dev-timeline" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/5">
              <div className="mb-10 text-center max-w-xl mx-auto">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00ff9d] uppercase tracking-wider mb-2">
                  <MapPin className="w-3.5 h-3.5" /> Experience & Milestones
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                  Trajectory & Engineering Impact
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  From machine learning deployments to enterprise IT integrations and business intelligence.
                </p>
              </div>
              <CareerTimeline />
            </section>

            {/* Section 3: Engineering Capabilities */}
            <section id="dev-services" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/5">
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00ff9d] uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Core Disciplines
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                  Technical Service Offerings
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {devServices.map((service: Service) => (
                  <div
                    key={service.title}
                    className="p-8 rounded-2xl bg-[#0a0f0d] border border-[#00ff9d]/20 hover:border-[#00ff9d]/50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="text-3xl mb-4 p-3 rounded-xl bg-black/40 w-fit border border-[#00ff9d]/15 text-[#00ff9d]">
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-bold font-display text-white mb-2">{service.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6">{service.description}</p>
                    </div>
                    <div className="pt-4 border-t border-white/5 space-y-2">
                      {service.details.map((detail: string) => (
                        <div key={detail} className="text-xs font-mono text-gray-300 flex items-center gap-2">
                          <span className="text-[#00ff9d]">›</span> {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: Contact / Inquiry Wizard */}
            <section id="dev-contact" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-white/5">
              <div className="text-center max-w-xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00ff9d] uppercase tracking-wider mb-2">
                  <FileText className="w-3.5 h-3.5" /> Start A Conversation
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                  Let&apos;s Build Something Resilient
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  Have a web application, mobile project, or systems challenge? Send over the details below.
                </p>
              </div>
              <InquiryWizard mode="developer" />
            </section>

            {/* Developer Footer */}
            <footer className="border-t border-white/10 py-12 text-center text-xs font-mono text-gray-400">
              <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span>© {CURRENT_YEAR} Chintan Rathod · Built on Cloudflare Workers & Vite</span>
                <button
                  onClick={() => switchMode('visual')}
                  className="text-gray-400 hover:text-[#00ff9d] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  Switch to Videography & Photography World →
                </button>
              </div>
            </footer>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* 3. VISUAL PORTFOLIO (CINEMATIC / GOLD / MEDIA)                    */}
        {/* ================================================================= */}
        {mode === 'visual' && (
          <motion.div
            key="visual"
            ref={visualTopRef}
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.4 }}
            className="relative z-10 min-h-screen text-gray-200"
          >
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0908]/85 border-b border-[#c8a45c]/20">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <button
                  onClick={() => switchMode('hub')}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#c8a45c]/10 border border-[#c8a45c]/30 flex items-center justify-center text-[#c8a45c] font-display font-bold text-sm group-hover:scale-105 transition-transform">
                    CR
                  </div>
                  <span className="font-mono text-xs text-gray-400 group-hover:text-[#c8a45c] transition-colors">
                    chintan.media
                  </span>
                </button>

                <nav className="hidden md:flex items-center gap-6 text-xs font-mono">
                  <a href="#visual-gallery" className="text-gray-400 hover:text-[#c8a45c] transition-colors">
                    01. Gallery
                  </a>
                  <a href="#visual-offerings" className="text-gray-400 hover:text-[#c8a45c] transition-colors">
                    02. Offerings & Gear
                  </a>
                  <a href="#visual-inquiry" className="text-gray-400 hover:text-[#c8a45c] transition-colors">
                    03. Booking
                  </a>
                </nav>

                <div className="flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/chintan992_2/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border border-[#c8a45c]/30 bg-[#c8a45c]/10 text-[#c8a45c] hover:bg-[#c8a45c]/20 transition-all"
                  >
                    <InstagramIcon className="w-4 h-4" />
                    <span>@chintan992_2</span>
                  </a>
                </div>
              </div>
            </header>

            {/* Visual Hero */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8a45c]/10 border border-[#c8a45c]/30 text-[#c8a45c] text-xs font-mono mb-6">
                <Film className="w-3.5 h-3.5" />
                <span>Cinematic Filmmaking · Documentary Photography</span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-display text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
                Light, stillness, and human moments framed with purpose.
              </h1>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mt-6">
                Based in Calgary, capturing the Canadian wilderness, editorial portraits, and cinematic brand stories. Every frame is treated with intentional color rhythm and organic grain.
              </p>

              <div className="flex justify-center items-center gap-4 mt-8">
                <a
                  href="#visual-gallery"
                  className="px-7 py-3 rounded-full bg-[#c8a45c] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#dfba70] transition-all shadow-[0_0_25px_rgba(200,164,92,0.35)] flex items-center gap-2 cursor-pointer"
                >
                  View Masonry Gallery <ArrowDown className="w-4 h-4" />
                </a>
                <a
                  href="#visual-inquiry"
                  className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-mono text-xs hover:border-[#c8a45c]/40 hover:bg-[#c8a45c]/5 transition-all flex items-center gap-2 cursor-pointer"
                >
                  Book Session
                </a>
              </div>
            </section>

            {/* Section 1: Masonry Media Gallery */}
            <section id="visual-gallery" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/5">
              <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-[#c8a45c] uppercase tracking-wider mb-2">
                    <Camera className="w-3.5 h-3.5" /> Field Notes & Curated Frames
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                    Moments in Focus
                  </h2>
                </div>
                <p className="text-xs font-mono text-gray-400">
                  Click any frame to launch high-resolution lightbox with zoom and details.
                </p>
              </div>
              <MasonryGallery />
            </section>

            {/* Section 2: Visual Services, Approach & Gear */}
            <section id="visual-offerings" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/5">
              <div className="text-center max-w-xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#c8a45c] uppercase tracking-wider mb-2">
                  <Film className="w-3.5 h-3.5" /> Creative Offerings & Toolkit
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                  Cinematic Production
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  Commercial campaigns, narrative shorts, and documentary stills built from intentional composition.
                </p>
              </div>
              <VisualServices />
            </section>

            {/* Section 3: Booking & Collaboration Wizard */}
            <section id="visual-inquiry" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-white/5">
              <div className="text-center max-w-xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#c8a45c] uppercase tracking-wider mb-2">
                  <FileText className="w-3.5 h-3.5" /> Commission & Inquiries
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                  Commission A Shoot or Production
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  Currently booking creative projects, brand films, and documentary assignments.
                </p>
              </div>
              <InquiryWizard mode="visual" defaultService="Videography" />
            </section>

            {/* Visual Footer */}
            <footer className="border-t border-white/10 py-12 text-center text-xs font-mono text-gray-400">
              <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span>© {CURRENT_YEAR} Chintan Rathod · Visual Storytelling</span>
                <button
                  onClick={() => switchMode('developer')}
                  className="text-gray-400 hover:text-[#c8a45c] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  Switch to Software Engineer World →
                </button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
