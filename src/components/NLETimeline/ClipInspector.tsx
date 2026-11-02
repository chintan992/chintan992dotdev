import { Info } from 'lucide-react'
import type { TimelineClip } from '@/data/timeline-clips'

interface ClipInspectorProps {
  activeClip: TimelineClip
  onNavigateToInquiry?: () => void
}

export default function ClipInspector({
  activeClip,
  onNavigateToInquiry,
}: ClipInspectorProps) {
  return (
    <aside
      aria-label="Clip Inspector Panel"
      className="lg:col-span-5 flex flex-col justify-between rounded-xl bg-[#131518] border border-white/[0.08] p-5 sm:p-6 space-y-6"
    >
      <div className="space-y-4">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-xs font-mono">
          <span className="text-zinc-400 font-semibold">CLIP INSPECTOR</span>
          <span className="text-zinc-500">ID: {activeClip.id}</span>
        </div>

        {/* Clip Title & Category */}
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

        {/* Description */}
        <p className="text-zinc-300 text-sm leading-relaxed">{activeClip.description}</p>

        {/* Technical Stack / Dependency Matrix */}
        {activeClip.techStack && (
          <div className="space-y-2 pt-2">
            <h3 className="text-[11px] font-mono text-zinc-400 uppercase tracking-wide">
              Dependency & Runtime Matrix
            </h3>
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
              <Info className="w-3.5 h-3.5" aria-hidden="true" />
              <span>SYSTEM TOPOLOGY</span>
            </div>
            <p className="leading-relaxed">{activeClip.architecture}</p>
          </div>
        )}
      </div>

      {/* Direct commission / navigation trigger */}
      <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
        <span className="text-zinc-400 font-mono text-[11px]">
          CALGARY RUNTIME & STUDIO
        </span>
        {onNavigateToInquiry && (
          <button
            type="button"
            onClick={onNavigateToInquiry}
            className="text-white hover:text-[#38bdf8] font-medium font-mono transition-colors cursor-pointer flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8] rounded px-1"
          >
            <span>Commission Practice →</span>
          </button>
        )}
      </div>
    </aside>
  )
}
