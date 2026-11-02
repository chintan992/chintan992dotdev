import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PortfolioMode, Service, Project } from '@/data/portfolio-data'
import { devServices, projects } from '@/data/portfolio-data'

// Components
import NavigationHeader from '@/components/NavigationHeader'
import EditorialHero from '@/components/EditorialHero'
import GitHubGrid from '@/components/GitHubGrid'
import CareerTimeline from '@/components/CareerTimeline'
import MasonryGallery from '@/components/MasonryGallery'
import VisualServices from '@/components/VisualServices'
import InquiryWizard from '@/components/InquiryWizard'
import ProjectModal from '@/components/ProjectModal'

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase()
      if (path.startsWith('/developer/projects/')) {
        const slug = path.slice('/developer/projects/'.length).replace(/\/$/, '')
        return (
          projects.find(
            (p) =>
              p.host.toLowerCase() === slug ||
              (slug === 'letsstream' && p.host === 'letstream'),
          ) ?? null
        )
      }
    }
    return null
  })

  const [mode, setMode] = useState<PortfolioMode>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase()
      if (
        path.startsWith('/developer') ||
        path.startsWith('/dev') ||
        path.startsWith('/engineering') ||
        path.startsWith('/projects')
      ) {
        return 'developer'
      }
      if (
        path.startsWith('/visual') ||
        path.startsWith('/photography') ||
        path.startsWith('/film')
      ) {
        return 'visual'
      }

      const hash = window.location.hash.toLowerCase()
      if (hash === '#developer' || hash === '#dev') return 'developer'
      if (hash === '#visual' || hash === '#media') return 'visual'
    }
    return 'hub'
  })

  // Sync mode and project with window location and update document title
  useEffect(() => {
    function handleLocationChange() {
      const path = window.location.pathname.toLowerCase()

      if (path.startsWith('/developer/projects/')) {
        const slug = path.slice('/developer/projects/'.length).replace(/\/$/, '')
        const found =
          projects.find(
            (p) =>
              p.host.toLowerCase() === slug ||
              (slug === 'letsstream' && p.host === 'letstream'),
          ) ?? null
        setSelectedProject(found)
        setMode('developer')
        return
      }

      setSelectedProject(null)

      if (
        path.startsWith('/developer') ||
        path.startsWith('/dev') ||
        path.startsWith('/engineering') ||
        path.startsWith('/projects')
      ) {
        setMode('developer')
        return
      }
      if (
        path.startsWith('/visual') ||
        path.startsWith('/photography') ||
        path.startsWith('/film')
      ) {
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

      if (path === '/inquiry' || path === '/contact' || hash === '#inquiry') {
        const el =
          document.getElementById('inquiry') ||
          document.getElementById('dev-inquiry') ||
          document.getElementById('visual-inquiry')
        el?.scrollIntoView({ behavior: 'smooth' })
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
    if (selectedProject) {
      document.title = `${selectedProject.name} — Software Project by Chintan Rathod`
    } else if (mode === 'developer') {
      document.title = 'Software Engineering — Chintan Rathod | Calgary'
    } else if (mode === 'visual') {
      document.title = 'Photography & Cinematography — Chintan Rathod | Calgary'
    } else {
      document.title = 'Chintan Rathod — Software Engineer & Photographer, Calgary'
    }
  }, [mode, selectedProject])

  function switchMode(newMode: PortfolioMode) {
    setMode(newMode)
    setSelectedProject(null)
    const targetPath = newMode === 'hub' ? '/' : `/${newMode}`
    window.history.pushState(null, '', targetPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openProject(project: Project) {
    setSelectedProject(project)
    setMode('developer')
    window.history.pushState(null, '', `/developer/projects/${project.host}`)
  }

  function closeProject() {
    setSelectedProject(null)
    window.history.pushState(null, '', '/developer')
  }

  function navigateToInquiry() {
    const el =
      document.getElementById('inquiry') ||
      document.getElementById('dev-inquiry') ||
      document.getElementById('visual-inquiry')
    if (el) {
      window.history.pushState(null, '', '/inquiry')
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="relative min-h-screen text-[#f4f5f6] font-sans bg-[#0c0d0e]">
      {/* Unified Navigation Bar */}
      <NavigationHeader
        mode={mode}
        onModeChange={switchMode}
        onNavigateToInquiry={navigateToInquiry}
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
              transition={{ duration: 0.3 }}
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

              {/* Core Disciplines & Technical Capabilities */}
              <section id="services" className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-8">
                  <div>
                    <div className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e2a868]" />
                      <span>Practice & Capabilities</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-medium font-display tracking-tight text-white">
                      Disciplines & Craft
                    </h2>
                  </div>
                  <button
                    onClick={() => switchMode('developer')}
                    className="text-xs font-medium text-zinc-300 hover:text-[#e2a868] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View all engineering work</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Dense spec list format */}
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
                        <p className="text-zinc-300 text-sm leading-relaxed">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-zinc-400">
                          {service.details.map((detail: string) => (
                            <span key={detail} className="flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#e2a868]" />
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
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e2a868]" />
                    <span>Inquiries & Direct Commissions</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-medium font-display text-white tracking-tight">
                    Start a Conversation
                  </h2>
                  <p className="text-zinc-400 text-sm mt-2">
                    Have a systems architecture challenge, mobile application, or commercial visual production in mind?
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
              transition={{ duration: 0.3 }}
              className="space-y-16 py-8"
            >
              {/* Focused Developer Hero */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-xs font-medium">
                      <Cpu className="w-3.5 h-3.5 text-[#e2a868]" />
                      <span>Software Engineering & Systems Architecture</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-medium font-display tracking-tight text-white leading-[1.15]">
                      Building reactive web platforms & high-performance runtimes.
                    </h1>

                    <p className="text-zinc-300 text-base leading-relaxed max-w-xl">
                      Engineering reactive web systems, Android playback pipelines, and edge cloud services with TypeScript, Kotlin, and Cloudflare Workers. Focusing on clean state architectures, measurable runtime efficiency, and rock-solid reliability.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <a
                        href="#dev-projects"
                        className="px-5 py-2.5 rounded-full bg-white text-[#0c0d0e] font-medium text-xs hover:bg-zinc-200 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        Explore engineering dossiers <ArrowDown className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    {/* Technical Profile Dossier */}
                    <div className="p-6 rounded-xl bg-[#141618] border border-white/[0.08] space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs">
                        <span className="font-medium text-white">Technical Profile</span>
                        <span className="text-zinc-400">Calgary, Canada</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                          <div className="text-zinc-400 text-[11px] font-medium">Primary Stack</div>
                          <div className="text-white font-medium mt-1">TypeScript · Kotlin</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                          <div className="text-zinc-400 text-[11px] font-medium">Mobile Runtimes</div>
                          <div className="text-white font-medium mt-1">Android · Flutter</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                          <div className="text-zinc-400 text-[11px] font-medium">Cloud Infrastructure</div>
                          <div className="text-white font-medium mt-1">Cloudflare · Node.js</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                          <div className="text-zinc-400 text-[11px] font-medium">Current Role</div>
                          <div className="text-white font-medium mt-1">Compugen Systems</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-300 leading-relaxed">
                        Available for systems architecture reviews, full-stack builds, and mobile systems engineering.
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Projects Grid */}
              <section id="dev-projects" className="max-w-6xl mx-auto px-4 sm:px-6">
                <GitHubGrid onSelectProject={openProject} />
              </section>

              {/* Career Timeline */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="mb-8">
                  <div className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#e2a868]" />
                    <span>Milestones & Experience</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-medium font-display text-white tracking-tight">
                    Trajectory & Engineering Delivery
                  </h2>
                </div>
                <CareerTimeline />
              </section>

              {/* Technical Service Disciplines */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="mb-8">
                  <div className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e2a868]" />
                    <span>Engineering Capabilities</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-medium font-display text-white tracking-tight">
                    Technical Disciplines
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {devServices.map((service: Service) => (
                    <div
                      key={service.title}
                      className="p-7 rounded-xl bg-[#141618] border border-white/[0.08] flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-lg font-medium font-display text-white mb-2">{service.title}</h3>
                        <p className="text-zinc-300 text-sm leading-relaxed mb-6">{service.description}</p>
                      </div>
                      <div className="pt-4 border-t border-white/[0.06] space-y-2">
                        {service.details.map((detail: string) => (
                          <div key={detail} className="text-xs text-zinc-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#e2a868] shrink-0" />
                            <span>{detail}</span>
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
                  <p className="text-zinc-400 text-sm mt-2">
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
              transition={{ duration: 0.3 }}
              className="space-y-16 py-8"
            >
              {/* Focused Visual Hero */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-10 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-xs font-medium mb-6">
                  <Film className="w-3.5 h-3.5 text-[#e2a868]" />
                  <span>Cinematic Filmmaking · Documentary Photography</span>
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium font-display text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
                  Light, stillness, and human moments framed with purpose.
                </h1>

                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mt-6">
                  Based in Calgary, capturing the Canadian wilderness, editorial portraits, and cinematic brand stories. Every frame is treated with intentional color rhythm and organic texture.
                </p>

                <div className="flex justify-center items-center gap-4 mt-8">
                  <a
                    href="#visual-gallery"
                    className="px-5 py-2.5 rounded-full bg-white text-[#0c0d0e] font-medium text-xs hover:bg-zinc-200 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    View gallery <ArrowDown className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="#visual-inquiry"
                    className="px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white text-xs font-medium hover:bg-white/[0.08] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Commission a session
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
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e2a868]" />
                    <span>Creative Suite</span>
                  </div>
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
                  <p className="text-zinc-400 text-sm mt-2">
                    Currently booking creative brand campaigns, commercial assignments, and editorial portraits.
                  </p>
                </div>
                <InquiryWizard mode="visual" defaultService="Videography" />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Project Case Study / Architecture Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={closeProject}
        onInquire={() => navigateToInquiry()}
      />

      {/* Editorial Footer */}
      <footer className="border-t border-white/[0.08] pt-16 pb-12 mt-24 text-xs text-zinc-400 bg-[#0c0d0e]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Column 1: Brand & Bio */}
            <div className="md:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#e2a868]" />
                <span className="font-display font-medium text-white text-base">Chintan Rathod</span>
              </div>
              <p className="text-zinc-400 leading-relaxed text-xs">
                Systems & Mobile Engineer · Cinematographer & Photographer based in Calgary, Alberta.
              </p>
              <div className="text-[11px] text-zinc-500">
                Staff Integration Technician at Compugen
              </div>
            </div>

            {/* Column 2: Software Engineering */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-zinc-200">
                Software Systems
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/developer"
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault()
                        switchMode('developer')
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Engineering Overview
                  </a>
                </li>
                <li>
                  <a
                    href="/developer/projects"
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault()
                        switchMode('developer')
                        document.getElementById('dev-projects')?.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Open Source Projects
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/chintan992"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <span>GitHub Profile</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/chintan-rathod.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <span>Curriculum Vitae (PDF)</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Visual & Film */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-zinc-200">
                Visual Stories
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/visual"
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault()
                        switchMode('visual')
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Cinematography Hub
                  </a>
                </li>
                <li>
                  <a
                    href="/visual#visual-gallery"
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault()
                        switchMode('visual')
                        document.getElementById('visual-gallery')?.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Curated Photo Gallery
                  </a>
                </li>
                <li>
                  <a
                    href="/visual#visual-offerings"
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault()
                        switchMode('visual')
                        document.getElementById('visual-offerings')?.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Production Suite & Gear
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/chintan992_2/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <span>Photography Instagram</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Collaboration & Contact */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-zinc-200">
                Direct Contact
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/inquiry"
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault()
                        navigateToInquiry()
                      }
                    }}
                    className="hover:text-white transition-colors text-[#e2a868] font-medium"
                  >
                    Send an inquiry
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:chintanr21@gmail.com"
                    className="hover:text-white transition-colors"
                  >
                    chintanr21@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/chintan992/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <span>LinkedIn</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
            <div>
              © {CURRENT_YEAR} Chintan Rathod · Calgary, Alberta · Built with React & Cloudflare Workers
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => switchMode(mode === 'developer' ? 'visual' : 'developer')}
                className="hover:text-zinc-300 transition-colors cursor-pointer"
              >
                Switch to {mode === 'developer' ? 'Photography & Film' : 'Software Engineering'}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
