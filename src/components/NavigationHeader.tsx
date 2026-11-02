import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { PortfolioMode } from '@/data/portfolio-data'
import { FileText, Menu, X, ArrowUpRight, Layers, Code2, Film, Mail } from 'lucide-react'
import { GithubIcon, InstagramIcon, LinkedinIcon } from '@/components/Icons'

interface NavigationHeaderProps {
  mode: PortfolioMode
  onModeChange: (mode: PortfolioMode) => void
  onNavigateToInquiry?: () => void
}

export default function NavigationHeader({
  mode,
  onModeChange,
  onNavigateToInquiry,
}: NavigationHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'hub', path: '/', label: 'Master Reel', shortLabel: 'Master', icon: Layers },
    { id: 'developer', path: '/developer', label: 'Systems & Code', shortLabel: 'Code', icon: Code2 },
    { id: 'visual', path: '/visual', label: 'Cinema & Stills', shortLabel: 'Cinema', icon: Film },
  ] as const

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#090a0d]/92 border-b border-white/[0.08] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Monogram & Location */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault()
                onModeChange('hub')
              }
            }}
            className="flex items-center gap-3 group text-left cursor-pointer"
            aria-label="Return to overview"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/[0.05] border border-white/12 flex items-center justify-center font-display font-medium text-xs sm:text-sm text-white group-hover:border-white/25 transition-all">
              CR
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-[#090a0d]" />
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-medium text-sm tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                Chintan Rathod
              </div>
              <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5">
                <span className="text-emerald-400 font-semibold">● ONLINE</span>
                <span className="text-zinc-600">/</span>
                <span>CALGARY, AB</span>
              </div>
            </div>
          </a>
        </div>

        {/* Central Segmented Persona Switcher */}
        <nav aria-label="View switcher" className="flex items-center p-1 rounded-lg bg-[#131518] border border-white/[0.08] shadow-inner shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = mode === item.id
            return (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    e.preventDefault()
                    onModeChange(item.id)
                  }
                }}
                className={cn(
                  'relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-md text-xs font-mono transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'text-[#090a0d] font-bold'
                    : 'text-zinc-400 hover:text-white',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    className="absolute inset-0 bg-[#f1f5f9] rounded-md"
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-[#090a0d]' : 'text-zinc-400')} />
                  <span className="sm:hidden text-[11px] font-medium">{item.shortLabel}</span>
                  <span className="hidden sm:inline uppercase text-[11px]">{item.label}</span>
                </span>
              </a>
            )
          })}
        </nav>

        {/* Right Utilities & Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Resume PDF */}
          <a
            href="/chintan-rathod.pdf"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.07] hover:text-white transition-all"
            title="Download Resume (PDF)"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <span>CV</span>
          </a>

          {/* Social Quick Icons */}
          <div className="flex items-center border-l border-white/[0.08] pl-2.5 ml-1 gap-1">
            <a
              href="https://github.com/chintan992"
              target="_blank"
              rel="noreferrer noopener"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/chintan992_2/"
              target="_blank"
              rel="noreferrer noopener"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              aria-label="Instagram Photography"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/chintan992/"
              target="_blank"
              rel="noreferrer noopener"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Direct Inquiry CTA */}
          <a
            href="/inquiry"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault()
                if (onNavigateToInquiry) {
                  onNavigateToInquiry()
                } else {
                  onModeChange('hub')
                }
              }
            }}
            className="ml-1 px-4 py-1.5 rounded-lg bg-white text-[#090a0d] font-semibold text-xs hover:bg-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Docket</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white bg-white/[0.04] border border-white/[0.08] cursor-pointer"
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
            className="lg:hidden border-t border-white/[0.08] bg-[#090a0d]/98 backdrop-blur-2xl px-5 py-6 space-y-4"
          >
            <div className="space-y-2">
              <a
                href="/chintan-rathod.pdf"
                target="_blank"
                rel="noreferrer noopener"
                className="w-full p-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-left flex items-center justify-between text-xs font-medium text-zinc-200"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-zinc-400" />
                  <span>Download Resume (PDF)</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
              </a>
            </div>

            <div className="flex items-center justify-around py-3 border-y border-white/[0.08]">
              <a
                href="https://github.com/chintan992"
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1.5 text-xs text-zinc-300"
              >
                <GithubIcon className="w-4 h-4" /> GitHub
              </a>
              <a
                href="https://www.instagram.com/chintan992_2/"
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1.5 text-xs text-zinc-300"
              >
                <InstagramIcon className="w-4 h-4" /> Visuals
              </a>
              <a
                href="https://www.linkedin.com/in/chintan992/"
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1.5 text-xs text-zinc-300"
              >
                <LinkedinIcon className="w-4 h-4" /> LinkedIn
              </a>
            </div>

            <a
              href="/inquiry"
              onClick={(e) => {
                setMobileMenuOpen(false)
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault()
                  if (onNavigateToInquiry) {
                    onNavigateToInquiry()
                  } else {
                    onModeChange('hub')
                  }
                }
              }}
              className="w-full py-2.5 rounded-lg bg-white text-[#090a0d] font-semibold text-xs flex items-center justify-center gap-2"
            >
              Commission Studio <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
