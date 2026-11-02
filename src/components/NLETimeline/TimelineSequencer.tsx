import { useRef } from 'react'
import { Film, Camera, Code2, Briefcase } from 'lucide-react'
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

interface TimelineSequencerProps {
  currentTime: number
  activeClipId: string
  activeTrackFilter: 'all' | TrackType
  onSelectClip: (clip: TimelineClip) => void
  onScrub: (newTime: number) => void
}

export default function TimelineSequencer({
  currentTime,
  activeClipId,
  activeTrackFilter,
  onSelectClip,
  onScrub,
}: TimelineSequencerProps) {
  const timelineRef = useRef<HTMLDivElement>(null)

  function handleTimelineScrub(e: React.MouseEvent<HTMLDivElement>) {
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const ratio = clickX / rect.width
    const newTime = Math.round(ratio * TOTAL_TIMELINE_SECONDS)
    onScrub(newTime)
  }

  function handleRulerKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      onScrub(Math.max(0, currentTime - 5))
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      onScrub(Math.min(TOTAL_TIMELINE_SECONDS, currentTime + 5))
    } else if (e.key === 'Home') {
      e.preventDefault()
      onScrub(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      onScrub(TOTAL_TIMELINE_SECONDS)
    } else if (e.key === 'PageDown') {
      e.preventDefault()
      onScrub(Math.min(TOTAL_TIMELINE_SECONDS, currentTime + 15))
    } else if (e.key === 'PageUp') {
      e.preventDefault()
      onScrub(Math.max(0, currentTime - 15))
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
      <div className="rounded-xl bg-[#131518] border border-white/[0.08] overflow-hidden">
        {/* Horizontal scroll container for mobile responsiveness */}
        <div className="overflow-x-auto min-w-full scrollbar-thin">
          <div className="min-w-[640px]">
            {/* Timeline Transport Ruler / Timecode Header */}
            <div
              ref={timelineRef}
              role="slider"
              tabIndex={0}
              aria-label="Timeline position scrubber"
              aria-valuemin={0}
              aria-valuemax={TOTAL_TIMELINE_SECONDS}
              aria-valuenow={Math.round(currentTime)}
              aria-valuetext={formatTimecode(currentTime)}
              onClick={handleTimelineScrub}
              onKeyDown={handleRulerKeyDown}
              className="relative h-9 bg-[#171a1e] border-b border-white/[0.08] cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8] focus-visible:ring-inset"
              title="Click or drag to scrub playhead, or use arrow keys when focused"
            >
              {/* Timecode markers across 120s */}
              <div
                className="absolute inset-0 flex justify-between px-3 text-[10px] font-mono text-zinc-400 items-center pointer-events-none"
                aria-hidden="true"
              >
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
              <div
                className="absolute inset-0 flex justify-between px-3 items-end pointer-events-none opacity-20"
                aria-hidden="true"
              >
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
                aria-hidden="true"
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
                aria-hidden="true"
              />

              {/* Track 1: V1 4K Motion Reel */}
              {(activeTrackFilter === 'all' || activeTrackFilter === 'v1') && (
                <div className="relative h-12 flex items-center group">
                  <div className="sticky left-0 w-28 sm:w-32 shrink-0 px-3 flex items-center gap-1.5 text-[11px] font-mono text-[#e59846] bg-[#131518] h-full border-r border-white/[0.08] z-10 shadow-sm">
                    <Film className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="font-semibold">V1 MOTION</span>
                  </div>
                  <div className="relative flex-1 h-full">
                    {timelineClips
                      .filter((c) => c.track === 'v1')
                      .map((clip) => {
                        const isSelected = clip.id === activeClipId
                        const leftPercent = (clip.startTime / TOTAL_TIMELINE_SECONDS) * 100
                        const widthPercent = (clip.duration / TOTAL_TIMELINE_SECONDS) * 100
                        return (
                          <button
                            key={clip.id}
                            type="button"
                            aria-pressed={isSelected}
                            aria-label={`${clip.title} (4K Motion, ${clip.duration}s)`}
                            onClick={() => onSelectClip(clip)}
                            style={{
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                            }}
                            className={`absolute top-1 bottom-1 px-2.5 rounded text-left flex items-center justify-between text-xs font-mono transition-all overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8] ${
                              isSelected
                                ? 'bg-[#e59846] text-[#090a0d] font-bold shadow-lg ring-2 ring-white/40'
                                : 'bg-[#e59846]/15 hover:bg-[#e59846]/30 border border-[#e59846]/40 text-[#e59846]'
                            }`}
                          >
                            <span className="truncate">{clip.title}</span>
                            <span className="text-[10px] opacity-75 hidden sm:inline shrink-0" aria-hidden="true">
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
                  <div className="sticky left-0 w-28 sm:w-32 shrink-0 px-3 flex items-center gap-1.5 text-[11px] font-mono text-[#94a3b8] bg-[#131518] h-full border-r border-white/[0.08] z-10 shadow-sm">
                    <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="font-semibold">V2 STILLS</span>
                  </div>
                  <div className="relative flex-1 h-full">
                    {timelineClips
                      .filter((c) => c.track === 'v2')
                      .map((clip) => {
                        const isSelected = clip.id === activeClipId
                        const leftPercent = (clip.startTime / TOTAL_TIMELINE_SECONDS) * 100
                        const widthPercent = (clip.duration / TOTAL_TIMELINE_SECONDS) * 100
                        return (
                          <button
                            key={clip.id}
                            type="button"
                            aria-pressed={isSelected}
                            aria-label={`${clip.title} (Still Plate, ${clip.duration}s)`}
                            onClick={() => onSelectClip(clip)}
                            style={{
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                            }}
                            className={`absolute top-1 bottom-1 px-2.5 rounded text-left flex items-center justify-between text-xs font-mono transition-all overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8] ${
                              isSelected
                                ? 'bg-[#f1f5f9] text-[#090a0d] font-bold shadow-lg ring-2 ring-white/40'
                                : 'bg-[#94a3b8]/15 hover:bg-[#94a3b8]/30 border border-[#94a3b8]/40 text-[#f1f5f9]'
                            }`}
                          >
                            <span className="truncate">{clip.title}</span>
                            <span className="text-[10px] opacity-75 hidden sm:inline shrink-0" aria-hidden="true">
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
                  <div className="sticky left-0 w-28 sm:w-32 shrink-0 px-3 flex items-center gap-1.5 text-[11px] font-mono text-[#38bdf8] bg-[#131518] h-full border-r border-white/[0.08] z-10 shadow-sm">
                    <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="font-semibold">SYS CODE</span>
                  </div>
                  <div className="relative flex-1 h-full">
                    {timelineClips
                      .filter((c) => c.track === 'sys')
                      .map((clip) => {
                        const isSelected = clip.id === activeClipId
                        const leftPercent = (clip.startTime / TOTAL_TIMELINE_SECONDS) * 100
                        const widthPercent = (clip.duration / TOTAL_TIMELINE_SECONDS) * 100
                        return (
                          <button
                            key={clip.id}
                            type="button"
                            aria-pressed={isSelected}
                            aria-label={`${clip.title} (System Runtime, ${clip.duration}s)`}
                            onClick={() => onSelectClip(clip)}
                            style={{
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                            }}
                            className={`absolute top-1 bottom-1 px-2.5 rounded text-left flex items-center justify-between text-xs font-mono transition-all overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8] ${
                              isSelected
                                ? 'bg-[#38bdf8] text-[#090a0d] font-bold shadow-lg ring-2 ring-white/40'
                                : 'bg-[#38bdf8]/15 hover:bg-[#38bdf8]/30 border border-[#38bdf8]/40 text-[#38bdf8]'
                            }`}
                          >
                            <span className="truncate">{clip.title}</span>
                            <span className="text-[10px] opacity-75 hidden sm:inline shrink-0" aria-hidden="true">
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
                  <div className="sticky left-0 w-28 sm:w-32 shrink-0 px-3 flex items-center gap-1.5 text-[11px] font-mono text-[#a78bfa] bg-[#131518] h-full border-r border-white/[0.08] z-10 shadow-sm">
                    <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="font-semibold">OPS LOG</span>
                  </div>
                  <div className="relative flex-1 h-full">
                    {timelineClips
                      .filter((c) => c.track === 'ops')
                      .map((clip) => {
                        const isSelected = clip.id === activeClipId
                        const leftPercent = (clip.startTime / TOTAL_TIMELINE_SECONDS) * 100
                        const widthPercent = (clip.duration / TOTAL_TIMELINE_SECONDS) * 100
                        return (
                          <button
                            key={clip.id}
                            type="button"
                            aria-pressed={isSelected}
                            aria-label={`${clip.title} (Operational Milestone, ${clip.duration}s)`}
                            onClick={() => onSelectClip(clip)}
                            style={{
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                            }}
                            className={`absolute top-1 bottom-1 px-2.5 rounded text-left flex items-center justify-between text-xs font-mono transition-all overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8] ${
                              isSelected
                                ? 'bg-[#a78bfa] text-[#090a0d] font-bold shadow-lg ring-2 ring-white/40'
                                : 'bg-[#a78bfa]/15 hover:bg-[#a78bfa]/30 border border-[#a78bfa]/40 text-[#a78bfa]'
                            }`}
                          >
                            <span className="truncate">{clip.title}</span>
                            <span className="text-[10px] opacity-75 hidden sm:inline shrink-0" aria-hidden="true">
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
      </div>
    </div>
  )
}
