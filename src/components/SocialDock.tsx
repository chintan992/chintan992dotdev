import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Camera, Mail, Check, Share2, FileText } from 'lucide-react'
import { GithubIcon, InstagramIcon, LinkedinIcon } from '@/components/Icons'
import type { PortfolioMode } from '@/data/portfolio-data'

interface SocialDockProps {
  mode: PortfolioMode
}

export default function SocialDock({ mode }: SocialDockProps) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const isDev = mode === 'developer'
  const isHub = mode === 'hub'

  function copyEmail() {
    void navigator.clipboard.writeText('chintanr21@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/chintan992',
      icon: GithubIcon,
      color: '#00ff9d',
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/chintan992/',
      icon: InstagramIcon,
      color: '#e1306c',
    },
    {
      name: 'Photo Work',
      href: 'https://www.instagram.com/chintan992_2/',
      icon: Camera,
      color: '#c8a45c',
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/chintan992/',
      icon: LinkedinIcon,
      color: '#0a66c2',
    },
    {
      name: 'Resume (PDF)',
      href: '/chintan-rathod.pdf',
      icon: FileText,
      color: '#3857ef',
    },
  ]

  return (
    <div className="fixed top-5 right-5 z-40">
      {/* Mobile Toggle / Floating Pill */}
      <div className="flex items-center gap-2">
        <AnimatePresence>
          {(isOpen || typeof window === 'undefined' || window.innerWidth >= 768) && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={cn(
                'flex items-center gap-1.5 p-1.5 rounded-full backdrop-blur-xl border transition-all duration-300',
                isDev
                  ? 'bg-[#0a0f0d]/85 border-[#00ff9d]/20 shadow-[0_4px_25px_rgba(0,255,157,0.1)]'
                  : isHub
                  ? 'bg-black/60 border-white/10 shadow-xl'
                  : 'bg-[#181614]/85 border-[#c8a45c]/20 shadow-[0_4px_25px_rgba(200,164,92,0.1)]',
              )}
            >
              {socialLinks.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={item.name}
                    className="group relative p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-115" />
                    {/* Tooltip */}
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono font-medium text-white bg-black/90 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {item.name}
                    </span>
                  </a>
                )
              })}

              <button
                onClick={copyEmail}
                aria-label="Copy Email"
                className="group relative p-2 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Mail className="w-4 h-4 transition-transform group-hover:scale-115" />
                )}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono font-medium text-white bg-black/90 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {copied ? 'Copied!' : 'Copy Email'}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'md:hidden p-2.5 rounded-full backdrop-blur-xl border text-gray-300 transition-all cursor-pointer',
            isDev
              ? 'bg-[#0a0f0d]/90 border-[#00ff9d]/30 text-[#00ff9d]'
              : 'bg-[#181614]/90 border-[#c8a45c]/30 text-[#c8a45c]',
          )}
          aria-label="Toggle socials dock"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
