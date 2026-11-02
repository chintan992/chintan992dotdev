import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  ExternalLink,
  Code2,
  Film,
  Camera,
  Briefcase,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { GithubIcon } from '@/components/Icons'
import { projects, type Project } from '@/data/portfolio-data'
import {
  timelineClips,
  TOTAL_TIMELINE_SECONDS,
  type TimelineClip,
  type TrackType,
} from '@/data/timeline-clips'

function formatTimecode(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const frames = Math.floor((seconds % 1) * 24)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`
}

interface NLETimelineStudioProps {
  onOpenProject?: (project: Project) => void
  onNavigateToInquiry?: () => void
}

export default function NLETimelineStudio({
  onOpenProject,
  onNavigateToInquiry,
}: NLETimelineStudioProps) {
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [selectedClipId, setSelectedClipId] = useState<string>('clip-v1-car')
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const [activeTrackFilter, setActiveTrackFilter] = useState<'all' | TrackType>('all')

  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Determine active clip: during playback derive from currentTime, otherwise use selectedClipId
  const activeClip = isPlaying
    ? (timelineClips.find((c) => {
        if (activeTrackFilter !== 'all' && c.track !== activeTrackFilter) return false
        return currentTime >= c.startTime && currentTime < c.startTime + c.duration
      }) ?? timelineClips.find((c) => c.id === selectedClipId) ?? timelineClips[0])
    : (timelineClips.find((c) => c.id === selectedClipId) ?? timelineClips[0])

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.5
        if (next >= TOTAL_TIMELINE_SECONDS) {
          return 0
        }
        return next
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isPlaying])

  function jumpToNextClip() {
    const list =
      activeTrackFilter === 'all'
        ? timelineClips
        : timelineClips.filter((c) => c.track === activeTrackFilter)
    const idx = list.findIndex((c) => c.id === activeClip.id)
    const nextClip = list[(idx + 1) % list.length]
    setSelectedClipId(nextClip.id)
    setCurrentTime(nextClip.startTime)
  }

  function jumpToPrevClip() {
    const list =
      activeTrackFilter === 'all'
        ? timelineClips
        : timelineClips.filter((c) => c.track === activeTrackFilter)
    const idx = list.findIndex((c) => c.id === activeClip.id)
    const prevClip = list[(idx - 1 + list.length) % list.length]
    setSelectedClipId(prevClip.id)
    setCurrentTime(prevClip.startTime)
  }

  // Keyboard transport controls
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return

      if (e.code === 'Space') {
        e.preventDefault()
        setIsPlaying((p) => !p)
      } else if (e.code === 'ArrowRight' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        jumpToNextClip()
      } else if (e.code === 'ArrowLeft' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        jumpToPrevClip()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  function selectClip(clip: TimelineClip) {
    setSelectedClipId(clip.id)
    setCurrentTime(clip.startTime)
    setIsPlaying(false)
  }

  function handleTimelineScrub(e: React.MouseEvent<HTMLDivElement>) {
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const ratio = clickX / rect.width
    const newTime = Math.round(ratio * TOTAL_TIMELINE_SECONDS)
    setCurrentTime(newTime)

    const match = timelineClips.find((c) => {
      if (activeTrackFilter !== 'all' && c.track !== activeTrackFilter) return false
      return newTime >= c.startTime && newTime < c.startTime + c.duration
    })
    if (match) {
      setSelectedClipId(match.id)
    }
  }

  // Correlate active clip to projects data if code
  const correlatedProject =
    activeClip.mediaType === 'code'
      ? projects.find((p) => p.name.toLowerCase() === activeClip.title.toLowerCase())
      : null

  return (
    <section
      aria-label="NLE Timeline Studio"
      className="w-full bg-[#090a0d] border-b border-white/[0.08] text-[#f1f5f9]"
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. MASTER TRANSPORT & STUDIO HEADER                           */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-3 border-b border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Studio ID & Timecode */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#131518] border border-white/[0.1] font-mono text-[11px]">
              <span
                className={`w-2 h-2 rounded-full ${
                  isPlaying ? 'bg-[#ef4444] animate-pulse' : 'bg-emerald-500'
                }`}
              />
              <span className="text-zinc-400">REC</span>
              <span className="text-white font-semibold tabular-nums">
                {formatTimecode(currentTime)}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
              <span>23.976 FPS</span>
              <span className="text-zinc-600">/</span>
              <span>4K MASTER</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-300">CALGARY 51.04°N</span>
            </div>
          </div>

          {/* Transport Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#131518] border border-white/[0.1] rounded p-0.5">
              <button
                onClick={jumpToPrevClip}
                aria-label="Previous clip (Left Arrow)"
                className="p-1.5 rounded hover:bg-white/[0.06] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Previous clip [←]"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause sequence (Space)' : 'Play sequence (Space)'}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-white text-[#090a0d] font-semibold text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
                title="Play / Pause [Space]"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>PLAY REEL</span>
                  </>
                )}
              </button>

              <button
                onClick={jumpToNextClip}
                aria-label="Next clip (Right Arrow)"
                className="p-1.5 rounded hover:bg-white/[0.06] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Next clip [→]"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setCurrentTime(0)
                  setIsPlaying(false)
                }}
                aria-label="Reset to beginning"
                className="p-1.5 rounded hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Return to 00:00:00"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Track Solo Filters */}
            <div className="hidden lg:flex items-center bg-[#131518] border border-white/[0.1] rounded p-0.5 text-[11px] font-mono">
              {[
                { id: 'all', label: 'ALL TRACKS' },
                { id: 'v1', label: 'V1 MOTION' },
                { id: 'v2', label: 'V2 STILLS' },
                { id: 'sys', label: 'SYS CODE' },
                { id: 'ops', label: 'OPS' },
              ].map((filter) => {
                const isActive = activeTrackFilter === filter.id
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveTrackFilter(filter.id as typeof activeTrackFilter)}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. DUAL-PANE PROGRAM MONITOR & CLIP INSPECTOR                  */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Program Monitor (Viewport) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-xl bg-[#131518] border border-white/[0.08] overflow-hidden">
            {/* Monitor Header Strip */}
            <div className="px-4 py-2.5 bg-[#171a1e] border-b border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: activeClip.color }}
                />
                <span className="text-white font-medium">{activeClip.badge}</span>
                <span className="text-zinc-500">|</span>
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
                    />
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="absolute bottom-3 right-3 p-2 rounded bg-black/70 backdrop-blur-sm text-white hover:bg-black transition-colors cursor-pointer"
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
                        <Code2 className="w-4 h-4" />
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
                            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shrink-0" />
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
                        <Briefcase className="w-4 h-4" />
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
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#a78bfa] shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Viewfinder Reticle / Framing Guides */}
              <div className="absolute inset-0 pointer-events-none border border-white/[0.08]">
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
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-medium transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5 fill-current" />
                    <span>Source</span>
                  </a>
                )}
                {correlatedProject && onOpenProject && (
                  <button
                    onClick={() => onOpenProject(correlatedProject)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#38bdf8] text-[#090a0d] hover:bg-[#7dd3fc] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Full Spec</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Clip Inspector Panel (Right Column) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-xl bg-[#131518] border border-white/[0.08] p-5 sm:p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-xs font-mono">
                <span className="text-zinc-400">CLIP INSPECTOR</span>
                <span className="text-zinc-500">ID: {activeClip.id}</span>
              </div>

              <div>
                <span
                  className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold mb-2 uppercase"
                  style={{
                    backgroundColor: `${activeClip.color}20`,
                    color: activeClip.color,
                    border: `1px solid ${activeClip.color}40`,
                  }}
                >
                  {activeClip.badge}
                </span>
                <h2 className="text-2xl font-display font-medium text-white tracking-tight">
                  {activeClip.title}
                </h2>
                <div className="text-xs text-zinc-400 font-mono mt-0.5">
                  {activeClip.subtitle}
                </div>
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed">{activeClip.description}</p>

              {/* Technical Stack / Camera Kit Pills */}
              {activeClip.techStack && (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-mono text-zinc-400">
                    DEPENDENCY & RUNTIME MATRIX
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeClip.techStack.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-xs font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Architecture Synopsis */}
              {activeClip.architecture && (
                <div className="p-3.5 rounded-lg bg-black/40 border border-white/[0.06] text-xs text-zinc-300 space-y-1.5">
                  <div className="font-mono text-[11px] text-[#38bdf8] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>SYSTEM TOPOLOGY</span>
                  </div>
                  <p className="leading-relaxed">{activeClip.architecture}</p>
                </div>
              )}
            </div>

            {/* Direct commission / navigation trigger */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-mono text-[11px]">
                CALGARY PRAIRIE & MOUNTAIN STUDIO
              </span>
              {onNavigateToInquiry && (
                <button
                  onClick={onNavigateToInquiry}
                  className="text-white hover:text-[#38bdf8] font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Commission Practice →</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. MULTI-TRACK TIMELINE SEQUENCER                              */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
        <div className="rounded-xl bg-[#131518] border border-white/[0.08] overflow-hidden">
          {/* Timeline Transport Ruler / Timecode Header */}
          <div
            ref={timelineRef}
            onClick={handleTimelineScrub}
            className="relative h-9 bg-[#171a1e] border-b border-white/[0.08] cursor-pointer select-none"
            title="Click or drag to scrub playhead"
          >
            {/* Timecode markers across 120s */}
            <div className="absolute inset-0 flex justify-between px-3 text-[10px] font-mono text-zinc-400 items-center pointer-events-none">
              <span>00:00</span>
              <span>00:15</span>
              <span>00:30</span>
              <span>00:45</span>
              <span>01:00</span>
              <span>01:15</span>
              <span>01:30</span>
              <span>01:45</span>
              <span>02:00</span>
            </div>

            {/* Vertical Sub-Ticks */}
            <div className="absolute inset-0 flex justify-between px-3 items-end pointer-events-none opacity-20">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="w-[1px] h-2 bg-white" />
              ))}
            </div>

            {/* Playhead Indicator in Header */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-[#ef4444] z-20 pointer-events-none transition-all duration-75"
              style={{
                left: `${(currentTime / TOTAL_TIMELINE_SECONDS) * 100}%`,
              }}
            >
              <div className="w-3 h-3 bg-[#ef4444] -translate-x-1/2 rotate-45 -mt-1 rounded-xs" />
            </div>
          </div>

          {/* Tracks Sequencer Container */}
          <div className="relative divide-y divide-white/[0.06] bg-[#0e1013]">
            {/* Playhead Vertical Line traversing all tracks */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-[#ef4444] z-20 pointer-events-none transition-all duration-75"
              style={{
                left: `${(currentTime / TOTAL_TIMELINE_SECONDS) * 100}%`,
              }}
            />

            {/* Track 1: V1 4K Motion Reel */}
            {(activeTrackFilter === 'all' || activeTrackFilter === 'v1') && (
              <div className="relative h-12 flex items-center group">
                <div className="w-24 sm:w-32 shrink-0 px-3 flex items-center gap-1.5 text-[11px] font-mono text-[#e59846] bg-[#131518] h-full border-r border-white/[0.08] z-10">
                  <Film className="w-3.5 h-3.5" />
                  <span className="font-semibold">V1 MOTION</span>
                </div>
                <div className="relative flex-1 h-full">
                  {timelineClips
                    .filter((c) => c.track === 'v1')
                    .map((clip) => {
                      const isSelected = clip.id === activeClip.id
                      const leftPercent = (clip.startTime / TOTAL_TIMELINE_SECONDS) * 100
                      const widthPercent = (clip.duration / TOTAL_TIMELINE_SECONDS) * 100
                      return (
                        <button
                          key={clip.id}
                          onClick={() => selectClip(clip)}
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                          }}
                          className={`absolute top-1 bottom-1 px-2.5 rounded text-left flex items-center justify-between text-xs font-mono transition-all overflow-hidden cursor-pointer ${
                            isSelected
                              ? 'bg-[#e59846] text-[#090a0d] font-bold shadow-lg ring-2 ring-white/40'
                              : 'bg-[#e59846]/15 hover:bg-[#e59846]/30 border border-[#e59846]/40 text-[#e59846]'
                          }`}
                        >
                          <span className="truncate">{clip.title}</span>
                          <span className="text-[10px] opacity-75 hidden md:inline shrink-0">
                            {clip.duration}s
                          </span>
                        </button>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Track 2: V2 Stills & Plates */}
            {(activeTrackFilter === 'all' || activeTrackFilter === 'v2') && (
              <div className="relative h-12 flex items-center group">
                <div className="w-24 sm:w-32 shrink-0 px-3 flex items-center gap-1.5 text-[11px] font-mono text-[#94a3b8] bg-[#131518] h-full border-r border-white/[0.08] z-10">
                  <Camera className="w-3.5 h-3.5" />
                  <span className="font-semibold">V2 STILLS</span>
                </div>
                <div className="relative flex-1 h-full">
                  {timelineClips
                    .filter((c) => c.track === 'v2')
                    .map((clip) => {
                      const isSelected = clip.id === activeClip.id
                      const leftPercent = (clip.startTime / TOTAL_TIMELINE_SECONDS) * 100
                      const widthPercent = (clip.duration / TOTAL_TIMELINE_SECONDS) * 100
                      return (
                        <button
                          key={clip.id}
                          onClick={() => selectClip(clip)}
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                          }}
                          className={`absolute top-1 bottom-1 px-2.5 rounded text-left flex items-center justify-between text-xs font-mono transition-all overflow-hidden cursor-pointer ${
                            isSelected
                              ? 'bg-[#f1f5f9] text-[#090a0d] font-bold shadow-lg ring-2 ring-white/40'
                              : 'bg-[#94a3b8]/15 hover:bg-[#94a3b8]/30 border border-[#94a3b8]/40 text-[#f1f5f9]'
                          }`}
                        >
                          <span className="truncate">{clip.title}</span>
                          <span className="text-[10px] opacity-75 hidden md:inline shrink-0">
                            {clip.duration}s
                          </span>
                        </button>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Track 3: SYS Code Runtimes */}
            {(activeTrackFilter === 'all' || activeTrackFilter === 'sys') && (
              <div className="relative h-12 flex items-center group">
                <div className="w-24 sm:w-32 shrink-0 px-3 flex items-center gap-1.5 text-[11px] font-mono text-[#38bdf8] bg-[#131518] h-full border-r border-white/[0.08] z-10">
                  <Code2 className="w-3.5 h-3.5" />
                  <span className="font-semibold">SYS CODE</span>
                </div>
                <div className="relative flex-1 h-full">
                  {timelineClips
                    .filter((c) => c.track === 'sys')
                    .map((clip) => {
                      const isSelected = clip.id === activeClip.id
                      const leftPercent = (clip.startTime / TOTAL_TIMELINE_SECONDS) * 100
                      const widthPercent = (clip.duration / TOTAL_TIMELINE_SECONDS) * 100
                      return (
                        <button
                          key={clip.id}
                          onClick={() => selectClip(clip)}
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                          }}
                          className={`absolute top-1 bottom-1 px-2.5 rounded text-left flex items-center justify-between text-xs font-mono transition-all overflow-hidden cursor-pointer ${
                            isSelected
                              ? 'bg-[#38bdf8] text-[#090a0d] font-bold shadow-lg ring-2 ring-white/40'
                              : 'bg-[#38bdf8]/15 hover:bg-[#38bdf8]/30 border border-[#38bdf8]/40 text-[#38bdf8]'
                          }`}
                        >
                          <span className="truncate">{clip.title}</span>
                          <span className="text-[10px] opacity-75 hidden md:inline shrink-0">
                            {clip.duration}s
                          </span>
                        </button>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Track 4: OPS Milestones & Delivery */}
            {(activeTrackFilter === 'all' || activeTrackFilter === 'ops') && (
              <div className="relative h-12 flex items-center group">
                <div className="w-24 sm:w-32 shrink-0 px-3 flex items-center gap-1.5 text-[11px] font-mono text-[#a78bfa] bg-[#131518] h-full border-r border-white/[0.08] z-10">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span className="font-semibold">OPS LOG</span>
                </div>
                <div className="relative flex-1 h-full">
                  {timelineClips
                    .filter((c) => c.track === 'ops')
                    .map((clip) => {
                      const isSelected = clip.id === activeClip.id
                      const leftPercent = (clip.startTime / TOTAL_TIMELINE_SECONDS) * 100
                      const widthPercent = (clip.duration / TOTAL_TIMELINE_SECONDS) * 100
                      return (
                        <button
                          key={clip.id}
                          onClick={() => selectClip(clip)}
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                          }}
                          className={`absolute top-1 bottom-1 px-2.5 rounded text-left flex items-center justify-between text-xs font-mono transition-all overflow-hidden cursor-pointer ${
                            isSelected
                              ? 'bg-[#a78bfa] text-[#090a0d] font-bold shadow-lg ring-2 ring-white/40'
                              : 'bg-[#a78bfa]/15 hover:bg-[#a78bfa]/30 border border-[#a78bfa]/40 text-[#a78bfa]'
                          }`}
                        >
                          <span className="truncate">{clip.title}</span>
                          <span className="text-[10px] opacity-75 hidden md:inline shrink-0">
                            {clip.duration}s
                          </span>
                        </button>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
