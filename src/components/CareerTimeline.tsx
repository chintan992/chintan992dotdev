import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { timeline, type TimelineEntry } from '@/data/portfolio-data'
import { ChevronDown } from 'lucide-react'

function TimelineCard({ entry, isLast }: { entry: TimelineEntry; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="relative flex gap-4 sm:gap-6 group">
      {/* Timeline spine + quiet node */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-3 h-3 rounded-full bg-[#090a0d] border-2 border-[#a78bfa] mt-2 z-10 group-hover:scale-110 transition-transform" />
        {!isLast && (
          <div className="w-px flex-1 bg-white/[0.08] min-h-[40px]" />
        )}
      </div>

      {/* Card content */}
      <div
        className="flex-1 bg-[#131518] border border-white/[0.08] hover:border-[#a78bfa]/40 transition-colors p-5 sm:p-6 rounded-xl mb-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[#a78bfa] border border-[#a78bfa]/20">
                {entry.period}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {entry.label}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-white font-display">{entry.title}</h3>
            <p className="text-xs text-[#a78bfa] font-mono mt-0.5">{entry.org}</p>
          </div>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 mt-1',
              expanded && 'rotate-180 text-white',
            )}
          />
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-white/[0.06] mt-4">
                <p className="text-sm text-zinc-300 mb-3 leading-relaxed">{entry.description}</p>
                {entry.achievements && (
                  <ul className="space-y-2">
                    {entry.achievements.map((achievement: string) => (
                      <li key={achievement} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] mt-1.5 shrink-0" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function CareerTimeline() {
  return (
    <section className="w-full">
      <div className="relative">
        {timeline.map((entry: TimelineEntry, i: number) => (
          <TimelineCard
            key={entry.label + entry.org}
            entry={entry}
            isLast={i === timeline.length - 1}
          />
        ))}
      </div>
    </section>
  )
}
