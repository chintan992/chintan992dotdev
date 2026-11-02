import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
} from 'lucide-react'
import type { TrackType } from '@/data/timeline-clips'
import { formatTimecode } from '@/lib/playback-engine'

interface TransportBarProps {
  currentTime: number
  isPlaying: boolean
  onTogglePlay: () => void
  onPrev: () => void
  onNext: () => void
  onReset: () => void
  activeFilter: 'all' | TrackType
  onFilterChange: (filter: 'all' | TrackType) => void
}

export default function TransportBar({
  currentTime,
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
  onReset,
  activeFilter,
  onFilterChange,
}: TransportBarProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-3 border-b border-white/[0.08]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Studio ID & Timecode Readout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#131518] border border-white/[0.1] font-mono text-[11px]">
            <span
              className={`w-2 h-2 rounded-full motion-reduce:animate-none ${
                isPlaying ? 'bg-[#ef4444] animate-pulse' : 'bg-emerald-500'
              }`}
              aria-hidden="true"
            />
            <span className="text-zinc-400">REC</span>
            <span
              className="text-white font-semibold tabular-nums"
              aria-live="polite"
              aria-atomic="true"
            >
              {formatTimecode(currentTime)}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
            <span>23.976 FPS</span>
            <span className="text-zinc-600" aria-hidden="true">/</span>
            <span>4K MASTER</span>
            <span className="text-zinc-600" aria-hidden="true">/</span>
            <span className="text-zinc-300">CALGARY 51.04°N</span>
          </div>
        </div>

        {/* Transport Actions */}
        <div className="flex items-center gap-2">
          <div
            role="toolbar"
            aria-label="Playback transport controls"
            className="flex items-center bg-[#131518] border border-white/[0.1] rounded p-0.5"
          >
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous clip (Left Arrow)"
              className="p-1.5 rounded hover:bg-white/[0.06] text-zinc-300 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]"
              title="Previous clip [←]"
            >
              <SkipBack className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause sequence (Spacebar)' : 'Play sequence (Spacebar)'}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-white text-[#090a0d] font-semibold text-xs hover:bg-zinc-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]"
              title="Play / Pause [Space]"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  <span>PLAY REEL</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onNext}
              aria-label="Next clip (Right Arrow)"
              className="p-1.5 rounded hover:bg-white/[0.06] text-zinc-300 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]"
              title="Next clip [→]"
            >
              <SkipForward className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onReset}
              aria-label="Reset sequence to 00:00:00"
              className="p-1.5 rounded hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]"
              title="Return to 00:00:00"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>

          {/* Track Filter Tabs */}
          <div
            role="tablist"
            aria-label="Track filters"
            className="flex items-center max-w-full overflow-x-auto bg-[#131518] border border-white/[0.1] rounded p-0.5 text-[11px] font-mono"
          >
            {[
              { id: 'all', label: 'ALL TRACKS' },
              { id: 'v1', label: 'V1 MOTION' },
              { id: 'v2', label: 'V2 STILLS' },
              { id: 'sys', label: 'SYS CODE' },
              { id: 'ops', label: 'OPS' },
            ].map((filter) => {
              const isActive = activeFilter === filter.id
              return (
                <button
                  key={filter.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onFilterChange(filter.id as typeof activeFilter)}
                  className={`px-2.5 py-1 rounded whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8] ${
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
  )
}
