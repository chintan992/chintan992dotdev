import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { timeline, type TimelineEntry } from '@/data/portfolio-data'
import { Briefcase, GraduationCap, Award, ChevronDown } from 'lucide-react'

function TimelineIcon({ type }: { type: TimelineEntry['type'] }) {
  const cls = 'w-4 h-4'
  switch (type) {
    case 'work':
      return <Briefcase className={cls} />
    case 'education':
      return <GraduationCap className={cls} />
    case 'certification':
      return <Award className={cls} />
  }
}

function TimelineCard({ entry, index }: { entry: TimelineEntry; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 0.72, 0.18, 1] }}
      className="relative flex gap-3 sm:gap-6 group"
    >
      {/* Timeline line + node */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={cn(
            'w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center z-10 transition-all duration-300',
            'bg-[#0e1116] border-white/15 text-slate-300 group-hover:border-white/40 group-hover:text-white',
          )}
        >
          <TimelineIcon type={entry.type} />
        </div>
        {index < timeline.length - 1 && (
          <div className="w-px flex-1 bg-gradient-to-b from-white/15 to-transparent min-h-[36px] sm:min-h-[40px]" />
        )}
      </div>

      {/* Card content */}
      <div
        className="flex-1 bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.16] transition-colors p-4 sm:p-6 rounded-2xl mb-5 sm:mb-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                {entry.period}
              </span>
              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-medium">
                {entry.label}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-white font-display">{entry.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{entry.org}</p>
          </div>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 mt-1',
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
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-white/[0.08] mt-4">
                <p className="text-sm text-slate-300 mb-3 leading-relaxed">{entry.description}</p>
                {entry.achievements && (
                  <ul className="space-y-2">
                    {entry.achievements.map((achievement: string) => (
                      <li key={achievement} className="flex items-start gap-2 text-xs sm:text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                        <span className="text-slate-300">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function CareerTimeline() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.22, 0.72, 0.18, 1] }}
      className="w-full"
    >
      <div className="relative">
        {timeline.map((entry: TimelineEntry, i: number) => (
          <TimelineCard key={entry.label + entry.org} entry={entry} index={i} />
        ))}
      </div>
    </motion.section>
  )
}
