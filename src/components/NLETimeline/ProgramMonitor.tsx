import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Volume2,
  VolumeX,
  Code2,
  Briefcase,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import { GithubIcon } from '@/components/Icons'
import type { TimelineClip } from '@/data/timeline-clips'
import type { Project } from '@/data/portfolio-data'

interface ProgramMonitorProps {
  activeClip: TimelineClip
  isMuted: boolean
  onToggleMute: () => void
  correlatedProject: Project | null
  onOpenProject?: (project: Project) => void
}

export default function ProgramMonitor({
  activeClip,
  isMuted,
  onToggleMute,
  correlatedProject,
  onOpenProject,
}: ProgramMonitorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Respect prefers-reduced-motion for video
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotionQuery.matches) {
      video.pause()
    }
  }, [activeClip.id])

  return (
    <div
      role="region"
      aria-label={`Program Monitor: ${activeClip.title}`}
      className="lg:col-span-7 flex flex-col justify-between rounded-xl bg-[#131518] border border-white/[0.08] overflow-hidden"
    >
      {/* Monitor Header Strip */}
      <div className="px-4 py-2.5 bg-[#171a1e] border-b border-white/[0.06] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: activeClip.color }}
            aria-hidden="true"
          />
          <span className="text-white font-medium">{activeClip.badge}</span>
          <span className="text-zinc-500" aria-hidden="true">|</span>
          <span className="text-zinc-300 truncate max-w-[220px] sm:max-w-xs">
            {activeClip.title}
          </span>
        </div>
        <div className="text-zinc-400 text-[11px]">PROGRAM OUT</div>
      </div>

      {/* Monitor Canvas (Video / Photo / Code Sandbox) */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {activeClip.mediaType === 'video' && activeClip.mediaUrl && (
            <motion.div
              key={activeClip.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full"
            >
              <video
                ref={videoRef}
                src={activeClip.mediaUrl}
                poster={activeClip.thumbnailUrl}
                loop
                autoPlay
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
                aria-label={`Video: ${activeClip.title}`}
              />
              <button
                type="button"
                onClick={onToggleMute}
                className="absolute bottom-3 right-3 p-2 rounded bg-black/70 backdrop-blur-sm text-white hover:bg-black transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]"
                aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </motion.div>
          )}

          {activeClip.mediaType === 'photo' && activeClip.mediaUrl && (
            <motion.div
              key={activeClip.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full"
            >
              <img
                src={activeClip.mediaUrl}
                alt={activeClip.title}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          )}

          {activeClip.mediaType === 'code' && (
            <motion.div
              key={activeClip.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#0e1217] to-[#090b0e] text-left"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8]">
                  <Code2 className="w-4 h-4" aria-hidden="true" />
                  <span>RUNTIME ARCHITECTURE // {activeClip.title.toUpperCase()}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight">
                  {activeClip.subtitle}
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed max-w-xl">
                  {activeClip.description}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                <div className="text-[11px] font-mono text-zinc-400">
                  ENGINEERING HIGHLIGHTS
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-200">
                  {activeClip.highlights?.map((hl) => (
                    <div key={hl} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shrink-0" aria-hidden="true" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeClip.mediaType === 'ops' && (
            <motion.div
              key={activeClip.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#120f1c] to-[#090a0d] text-left"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#a78bfa]">
                  <Briefcase className="w-4 h-4" aria-hidden="true" />
                  <span>OPERATIONAL DELIVERY & LEADERSHIP</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight">
                  {activeClip.title}
                </h3>
                <div className="text-zinc-400 text-xs font-mono">{activeClip.subtitle}</div>
                <p className="text-zinc-300 text-sm leading-relaxed max-w-xl">
                  {activeClip.description}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/[0.08]">
                {activeClip.highlights?.map((hl) => (
                  <div key={hl} className="flex items-center gap-2 text-xs text-zinc-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#a78bfa] shrink-0" aria-hidden="true" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Viewfinder Reticle / Framing Guides */}
        <div className="absolute inset-0 pointer-events-none border border-white/[0.08]" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-t border-l border-white/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-b border-r border-white/20" />
        </div>
      </div>

      {/* Monitor Footer Telemetry */}
      <div className="px-4 py-3 bg-[#131518] border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-zinc-400 font-mono text-[11px]">
          {activeClip.metrics?.map((m) => (
            <span key={m.label}>
              <span className="text-zinc-500">{m.label}: </span>
              <span className="text-white font-medium">{m.value}</span>
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {activeClip.githubUrl && (
            <a
              href={activeClip.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-mono font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]"
            >
              <GithubIcon className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
              <span>Source</span>
            </a>
          )}
          {correlatedProject && onOpenProject && (
            <button
              type="button"
              onClick={() => onOpenProject(correlatedProject)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#38bdf8] text-[#090a0d] hover:bg-[#7dd3fc] text-xs font-mono font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]"
            >
              <span>Full Spec</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
