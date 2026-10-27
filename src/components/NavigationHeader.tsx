import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { PortfolioMode } from '@/data/portfolio-data'
import { Terminal as TerminalIcon, FileText, Menu, X, ArrowUpRight, Sparkles, Code2, Film, Mail } from 'lucide-react'
import { GithubIcon, InstagramIcon, LinkedinIcon } from '@/components/Icons'

interface NavigationHeaderProps {
  mode: PortfolioMode
  onModeChange: (mode: PortfolioMode) => void
  showTerminal: boolean
  onToggleTerminal: () => void
}

export default function NavigationHeader({
  mode,
  onModeChange,
  showTerminal,
  onToggleTerminal,
}: NavigationHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'hub', label: 'All Stories', shortLabel: 'All', icon: Sparkles },
    { id: 'developer', label: 'Systems & Code', shortLabel: 'Code', icon: Code2 },
    { id: 'visual', label: 'Cinematography', shortLabel: 'Film', icon: Film },
  ] as const

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#08090a]/85 border-b border-white/[0.08] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Monogram & Availability */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => onModeChange('hub')}
            className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer"
            aria-label="Return to overview"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 flex items-center justify-center font-display font-black text-xs sm:text-sm text-white group-hover:border-white/35 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              CR
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 border-2 border-[#08090a]" />
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-sm tracking-tight text-white group-hover:text-slate-200 transition-colors">
                Chintan Rathod
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                <span>Calgary, AB · Available</span>
              </div>
            </div>
          </button>
        </div>

        {/* Central Segmented Persona Switcher */}
        <nav aria-label="Perspective Switcher" className="flex items-center p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md shadow-inner shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = mode === item.id
            return (
              <button
                key={item.id}
                onClick={() => onModeChange(item.id)}
                className={cn(
                  'relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer',
                  isActive
                    ? 'text-black font-semibold'
                    : 'text-slate-400 hover:text-white',
                )}
                aria-pressed={isActive}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    className="absolute inset-0 bg-white rounded-full shadow-[0_2px_12px_rgba(255,255,255,0.25)]"
                  />
                )}
                <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                  <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-black' : 'text-slate-400')} />
                  <span className="sm:hidden text-[11px] font-mono">{item.shortLabel}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              </button>
            )
          })}
        </nav>

        {/* Right Utilities & Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Terminal Launcher */}
          <button
            onClick={onToggleTerminal}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-all cursor-pointer',
              showTerminal
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                : 'bg-white/[0.04] text-slate-300 border-white/[0.1] hover:bg-white/[0.08] hover:text-white',
            )}
            title="Toggle Command Line Console"
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>CLI</span>
          </button>

          {/* Resume PDF */}
          <a
            href="/chintan-rathod.pdf"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-mono text-slate-300 bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] hover:text-white transition-all"
            title="Download Resume (PDF)"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>CV</span>
          </a>

          {/* Social Quick Icons */}
          <div className="flex items-center border-l border-white/[0.1] pl-2.5 ml-1 gap-1">
            <a
              href="https://github.com/chintan992"
              target="_blank"
              rel="noreferrer noopener"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/chintan992_2/"
              target="_blank"
              rel="noreferrer noopener"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="Instagram Photography"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/chintan992/"
              target="_blank"
              rel="noreferrer noopener"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Direct Inquiry CTA */}
          <a
            href="#inquiry"
            className="ml-1 px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-1.5 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.1] cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/[0.08] bg-[#0c0e12]/95 backdrop-blur-2xl px-5 py-6 space-y-4"
          >
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => {
                  onToggleTerminal()
                  setMobileMenuOpen(false)
                }}
                className="p-2.5 rounded-xl border border-white/[0.1] bg-white/[0.03] text-left flex items-center gap-2 text-slate-200"
              >
                <TerminalIcon className="w-4 h-4 text-emerald-400" />
                <span>Open Terminal</span>
              </button>
              <a
                href="/chintan-rathod.pdf"
                target="_blank"
                rel="noreferrer noopener"
                className="p-2.5 rounded-xl border border-white/[0.1] bg-white/[0.03] text-left flex items-center gap-2 text-slate-200"
              >
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Resume (PDF)</span>
              </a>
            </div>

            <div className="flex items-center justify-around py-3 border-y border-white/[0.08]">
              <a
                href="https://github.com/chintan992"
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1.5 text-xs text-slate-300"
              >
                <GithubIcon className="w-4 h-4" /> GitHub
              </a>
              <a
                href="https://www.instagram.com/chintan992_2/"
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1.5 text-xs text-slate-300"
              >
                <InstagramIcon className="w-4 h-4" /> Visuals
              </a>
              <a
                href="https://www.linkedin.com/in/chintan992/"
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1.5 text-xs text-slate-300"
              >
                <LinkedinIcon className="w-4 h-4" /> LinkedIn
              </a>
            </div>

            <a
              href="#inquiry"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2"
            >
              Start an Inquiry <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
