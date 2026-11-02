import type { Project } from '@/data/portfolio-data'
import { usePlaybackEngine } from '@/hooks/usePlaybackEngine'

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
  const engine = usePlaybackEngine()
  const { state } = engine

  return (
    <section
      aria-label="NLE Timeline Studio"
      className="w-full bg-[#090a0d] border-b border-white/[0.08] text-[#f1f5f9]"
    >
      {/* 1. Master Transport Bar */}
      <TransportBar
        currentTime={state.currentTime}
        isPlaying={state.isPlaying}
        onTogglePlay={engine.togglePlay}
        onPrev={engine.prevClip}
        onNext={engine.nextClip}
        onReset={engine.reset}
        activeFilter={state.activeTrackFilter}
        onFilterChange={engine.setTrackFilter}
      />

      {/* 2. Dual-Pane Viewport & Inspector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <ProgramMonitor
            activeClip={state.activeClip}
            isMuted={state.isMuted}
            isPlaying={state.isPlaying}
            currentTime={state.currentTime}
            onToggleMute={engine.toggleMute}
            correlatedProject={state.correlatedProject}
            onOpenProject={onOpenProject}
          />
          <ClipInspector
            activeClip={state.activeClip}
            onNavigateToInquiry={onNavigateToInquiry}
          />
        </div>
      </div>

      {/* 3. Multi-Track Timeline Sequencer */}
      <TimelineSequencer
        currentTime={state.currentTime}
        activeClipId={state.activeClip.id}
        activeTrackFilter={state.activeTrackFilter}
        onSelectClip={engine.selectClip}
        onScrub={engine.seek}
      />
    </section>
  )
}
