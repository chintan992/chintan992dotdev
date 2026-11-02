import { useState, useEffect, useCallback } from 'react'
import { projects, type Project } from '@/data/portfolio-data'
import {
  timelineClips,
  TOTAL_TIMELINE_SECONDS,
  type TimelineClip,
  type TrackType,
} from '@/data/timeline-clips'

import TransportBar from './NLETimeline/TransportBar'
import ProgramMonitor from './NLETimeline/ProgramMonitor'
import ClipInspector from './NLETimeline/ClipInspector'
import TimelineSequencer from './NLETimeline/TimelineSequencer'

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

  // Derive active clip: during playback derive from currentTime, otherwise use selectedClipId
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

  const jumpToNextClip = useCallback(() => {
    const list =
      activeTrackFilter === 'all'
        ? timelineClips
        : timelineClips.filter((c) => c.track === activeTrackFilter)
    const idx = list.findIndex((c) => c.id === activeClip.id)
    const nextClip = list[(idx + 1) % list.length]
    setSelectedClipId(nextClip.id)
    setCurrentTime(nextClip.startTime)
  }, [activeTrackFilter, activeClip.id])

  const jumpToPrevClip = useCallback(() => {
    const list =
      activeTrackFilter === 'all'
        ? timelineClips
        : timelineClips.filter((c) => c.track === activeTrackFilter)
    const idx = list.findIndex((c) => c.id === activeClip.id)
    const prevClip = list[(idx - 1 + list.length) % list.length]
    setSelectedClipId(prevClip.id)
    setCurrentTime(prevClip.startTime)
  }, [activeTrackFilter, activeClip.id])

  // Global keyboard transport controls
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
  }, [jumpToNextClip, jumpToPrevClip])

  function handleSelectClip(clip: TimelineClip) {
    setSelectedClipId(clip.id)
    setCurrentTime(clip.startTime)
    setIsPlaying(false)
  }

  function handleScrub(newTime: number) {
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
      ? projects.find((p) => p.name.toLowerCase() === activeClip.title.toLowerCase()) ?? null
      : null

  return (
    <section
      aria-label="NLE Timeline Studio"
      className="w-full bg-[#090a0d] border-b border-white/[0.08] text-[#f1f5f9]"
    >
      {/* 1. Master Transport Bar */}
      <TransportBar
        currentTime={currentTime}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onPrev={jumpToPrevClip}
        onNext={jumpToNextClip}
        onReset={() => {
          setCurrentTime(0)
          setIsPlaying(false)
        }}
        activeFilter={activeTrackFilter}
        onFilterChange={setActiveTrackFilter}
      />

      {/* 2. Dual-Pane Viewport & Inspector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <ProgramMonitor
            activeClip={activeClip}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted((m) => !m)}
            correlatedProject={correlatedProject}
            onOpenProject={onOpenProject}
          />
          <ClipInspector
            activeClip={activeClip}
            onNavigateToInquiry={onNavigateToInquiry}
          />
        </div>
      </div>

      {/* 3. Multi-Track Timeline Sequencer */}
      <TimelineSequencer
        currentTime={currentTime}
        activeClipId={activeClip.id}
        activeTrackFilter={activeTrackFilter}
        onSelectClip={handleSelectClip}
        onScrub={handleScrub}
      />
    </section>
  )
}
