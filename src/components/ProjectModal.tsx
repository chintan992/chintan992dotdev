import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project } from '@/data/portfolio-data'
import Breadcrumbs from '@/components/Breadcrumbs'
import { GithubIcon } from '@/components/Icons'
import { X, ExternalLink, Cpu, CheckCircle2, ArrowRight } from 'lucide-react'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
  onInquire: (service: string) => void
}

export default function ProjectModal({
  project,
  onClose,
  onInquire,
}: ProjectModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (project) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#0e1114] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Header row with breadcrumbs & close */}
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4 mb-6">
              <Breadcrumbs
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Engineering', href: '/developer' },
                  { label: 'Projects', href: '/developer/projects' },
                  { label: project.name },
                ]}
              />
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors shrink-0 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Project Title & Category */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-0.5 rounded-full">
                  Case Study {project.number}
                </span>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  {project.category}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight">
                {project.name}
              </h2>
            </div>

            {/* Main Description */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              {project.description}
            </p>

            {/* Architecture Overview */}
            {project.architecture && (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] mb-6 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300 uppercase tracking-wider">
                  <Cpu className="w-4 h-4 text-slate-400" />
                  <span>Systems Architecture</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {project.architecture}
                </p>
              </div>
            )}

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="space-y-3 mb-6">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Architectural Highlights
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {project.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-start gap-2.5 text-xs font-mono text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack Matrix */}
            <div className="space-y-2 mb-8">
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.04] text-slate-300 border border-white/[0.08]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-mono bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] transition-all"
              >
                <GithubIcon className="w-4 h-4" />
                <span>View Source Code</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <button
                onClick={() => {
                  onClose()
                  onInquire('Software development')
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-mono bg-white text-black font-semibold hover:bg-slate-200 transition-all cursor-pointer"
              >
                <span>Inquire About Similar Architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

